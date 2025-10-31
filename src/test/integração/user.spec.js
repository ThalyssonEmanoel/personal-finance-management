import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest
} from "@jest/globals";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import app from "../../app.js";
import { faker } from "@faker-js/faker";
import { prisma } from "../../config/prismaClient.js";
import UserRepository from "../../repositories/UserRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");

jest.setTimeout(40000);

let adminToken;
let adminUser;

const createdUsers = new Map();
const generatedFiles = new Set();

const randomEmail = () => `user.${faker.string.alphanumeric({ length: 10, casing: "lower" })}.${Date.now()}@example.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;

const buildUserPayload = (overrides = {}) => ({
  name: overrides.name ?? `Test User ${faker.number.int({ min: 1000, max: 9999 })}`,
  email: overrides.email ?? randomEmail(),
  password: overrides.password ?? randomPassword(),
});

const trackUser = (id, data) => {
  if (!createdUsers.has(id)) {
    createdUsers.set(id, { ...data, cleaned: false });
  }
};

const markUserAsDeleted = (id) => {
  const info = createdUsers.get(id);
  if (info) {
    info.cleaned = true;
  }
};

const resolveFilePath = (filePath) => (
  path.isAbsolute(filePath) ? filePath : path.join(ROOT_DIR, filePath)
);

const registerGeneratedFile = (filePath) => {
  generatedFiles.add(filePath);
};

const loginUser = async (email, password) => {
  return request(app).post("/login").send({ email, password });
};

const expectUnauthorized = (response) => {
  expect(response.status).toBe(401);
  expect(response.body.error).toBe(true);
};

beforeAll(async () => {
  const response = await loginUser("thalysson140105@gmail.com", "Senha@12345");
  expect(response.status).toBe(200);
  adminToken = response.body.data.accessToken;
  adminUser = response.body.data.usuario;
});

afterAll(async () => {
  for (const filePath of generatedFiles) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore missing files during cleanup
    }
  }
  for (const [userId, info] of createdUsers.entries()) {
    if (info.cleaned) {
      continue;
    }
    try {
      await UserRepository.deleteUser(userId);
    } catch (error) {
      // User might have been deleted in the middle of the tests
    }
  }
  await prisma.$disconnect();
});

describe("POST /users", () => {
  it("deve cadastrar um usuário e criar a conta padrão", async () => {
    const payload = buildUserPayload();

    const response = await request(app)
      .post("/users")
      .field("name", payload.name)
      .field("email", payload.email)
      .field("password", payload.password);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toMatchObject({
      name: payload.name,
      email: payload.email,
    });
    expect(response.body.data).not.toHaveProperty("password");

    const createdUser = response.body.data;
    trackUser(createdUser.id, { email: payload.email, password: payload.password });

    const defaultAccount = await prisma.accounts.findFirst({
      where: { userId: createdUser.id, name: "Carteira" },
    });

    expect(defaultAccount).toBeTruthy();
    if (defaultAccount) {
      expect(defaultAccount.type).toBe("Carteira");
      expect(defaultAccount.userId).toBe(createdUser.id);
    }
  });

  it("não deve permitir cadastro com email duplicado", async () => {
    const payload = buildUserPayload();

    const firstResponse = await request(app)
      .post("/users")
      .field("name", payload.name)
      .field("email", payload.email)
      .field("password", payload.password);

    expect(firstResponse.status).toBe(201);
    const createdUser = firstResponse.body.data;
    trackUser(createdUser.id, { email: payload.email, password: payload.password });

    const duplicateResponse = await request(app)
      .post("/users")
      .field("name", `Duplicate ${payload.name}`)
      .field("email", payload.email)
      .field("password", randomPassword());

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.error).toBe(true);
  });

  it("não deve permitir cadastro com senha inválida", async () => {
    const invalidResponse = await request(app)
      .post("/users")
      .field("name", "User Senha Fraca")
      .field("email", randomEmail())
      .field("password", "12345678");

    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.message).toBeDefined();
  });

  it("deve aceitar upload de avatar durante o cadastro", async () => {
    const payload = buildUserPayload();
    const avatarBuffer = Buffer.from("fake image content");

    const response = await request(app)
      .post("/users")
      .field("name", payload.name)
      .field("email", payload.email)
      .field("password", payload.password)
      .attach("avatar", avatarBuffer, "avatar.png");

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    const createdUser = response.body.data;
    trackUser(createdUser.id, { email: payload.email, password: payload.password });

    expect(createdUser.avatar).toBeTruthy();
    if (createdUser.avatar) {
      const storedAvatarPath = resolveFilePath(createdUser.avatar);
      registerGeneratedFile(storedAvatarPath);
      const stats = await fs.stat(storedAvatarPath);
      expect(stats.isFile()).toBe(true);
    }
  });
});

describe("Rotas autenticadas de usuário", () => {
  let testUserId;
  let testToken;
  let credentials;
  let currentEmail;
  let currentName;

  beforeAll(async () => {
    credentials = buildUserPayload();

    const createResponse = await request(app)
      .post("/users")
      .field("name", credentials.name)
      .field("email", credentials.email)
      .field("password", credentials.password);

    expect(createResponse.status).toBe(201);
    const createdUser = createResponse.body.data;
    testUserId = createdUser.id;
    currentEmail = credentials.email;
    currentName = credentials.name;
    trackUser(createdUser.id, { email: credentials.email, password: credentials.password });

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    testToken = loginResponse.body.data.accessToken;
  });

  it("deve retornar os dados do usuário autenticado", async () => {
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toMatchObject({
      id: testUserId,
      email: currentEmail,
    });
    expect(response.body.data).not.toHaveProperty("password");
  });

  it("não deve permitir acesso sem token", async () => {
    const response = await request(app).get(`/users/${testUserId}`);
    expectUnauthorized(response);
  });

  it("não deve permitir acesso a outro usuário", async () => {
    const response = await request(app)
      .get(`/users/${adminUser.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(403);
  });

  it("deve atualizar nome e email do usuário", async () => {
    const newName = `Updated ${faker.number.int({ min: 1000, max: 9999 })}`;
    const newEmail = randomEmail();

    const response = await request(app)
      .patch(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .field("name", newName)
      .field("email", newEmail);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toMatchObject({
      id: testUserId,
      name: newName,
      email: newEmail,
    });

    currentName = newName;
    currentEmail = newEmail;
    credentials.email = newEmail;

    const loginResponse = await loginUser(newEmail, credentials.password);
    expect(loginResponse.status).toBe(200);
    testToken = loginResponse.body.data.accessToken;
  });

  it("deve atualizar o avatar do usuário", async () => {
    const avatarBuffer = Buffer.from("another fake image");

    const response = await request(app)
      .patch(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .attach("avatar", avatarBuffer, "profile.png");

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.avatar).toBeTruthy();

    const storedAvatarPath = resolveFilePath(response.body.data.avatar);
    registerGeneratedFile(storedAvatarPath);
    const stats = await fs.stat(storedAvatarPath);
    expect(stats.isFile()).toBe(true);
  });

  it("não deve permitir email em formato inválido", async () => {
    const response = await request(app)
      .patch(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .field("email", "email-invalido");

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("não deve permitir email duplicado de outro usuário", async () => {
    const response = await request(app)
      .patch(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .field("email", adminUser.email);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(true);
  });

  it("deve ignorar campos vazios durante atualização parcial", async () => {
    const response = await request(app)
      .patch(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .field("name", "")
      .field("email", "");

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toMatchObject({
      id: testUserId,
      name: currentName,
      email: currentEmail,
    });
  });
});

describe("PATCH /users/:id/change-password", () => {
  let passwordUserId;
  let passwordToken;
  let credentials;

  beforeAll(async () => {
    credentials = buildUserPayload();

    const createResponse = await request(app)
      .post("/users")
      .field("name", credentials.name)
      .field("email", credentials.email)
      .field("password", credentials.password);

    expect(createResponse.status).toBe(201);
    const createdUser = createResponse.body.data;
    passwordUserId = createdUser.id;
    trackUser(createdUser.id, { email: credentials.email, password: credentials.password });

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    passwordToken = loginResponse.body.data.accessToken;
  });

  it("não deve permitir alteração de senha sem token", async () => {
    const response = await request(app)
      .patch(`/users/${passwordUserId}/change-password`)
      .send({
        currentPassword: credentials.password,
        newPassword: randomPassword(),
        confirmPassword: randomPassword(),
      });

    expectUnauthorized(response);
  });

  it("não deve permitir senha com confirmação diferente", async () => {
    const newPassword = randomPassword();
    const response = await request(app)
      .patch(`/users/${passwordUserId}/change-password`)
      .set("Authorization", `Bearer ${passwordToken}`)
      .send({
        currentPassword: credentials.password,
        newPassword,
        confirmPassword: `${newPassword}diff`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("não deve permitir alteração com senha atual incorreta", async () => {
    const newPassword = randomPassword();
    const response = await request(app)
      .patch(`/users/${passwordUserId}/change-password`)
      .set("Authorization", `Bearer ${passwordToken}`)
      .send({
        currentPassword: `${credentials.password}Errada`,
        newPassword,
        confirmPassword: newPassword,
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("não deve permitir senha fraca", async () => {
    const weakPassword = "senha123";
    const response = await request(app)
      .patch(`/users/${passwordUserId}/change-password`)
      .set("Authorization", `Bearer ${passwordToken}`)
      .send({
        currentPassword: credentials.password,
        newPassword: weakPassword,
        confirmPassword: weakPassword,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("deve alterar a senha corretamente", async () => {
    const newPassword = randomPassword();
    const response = await request(app)
      .patch(`/users/${passwordUserId}/change-password`)
      .set("Authorization", `Bearer ${passwordToken}`)
      .send({
        currentPassword: credentials.password,
        newPassword,
        confirmPassword: newPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);

    const oldLogin = await loginUser(credentials.email, credentials.password);
    expect(oldLogin.status).toBe(401);

    const newLogin = await loginUser(credentials.email, newPassword);
    expect(newLogin.status).toBe(200);

    credentials.password = newPassword;
    passwordToken = newLogin.body.data.accessToken;
  });
});

describe("DELETE /users/:id", () => {
  let deletableUser;
  let deletableToken;
  let credentials;

  beforeEach(async () => {
    credentials = buildUserPayload();

    const createResponse = await request(app)
      .post("/users")
      .field("name", credentials.name)
      .field("email", credentials.email)
      .field("password", credentials.password);

    expect(createResponse.status).toBe(201);
    deletableUser = createResponse.body.data;
    trackUser(deletableUser.id, { email: credentials.email, password: credentials.password });

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    deletableToken = loginResponse.body.data.accessToken;
  });

  afterEach(async () => {
    if (deletableUser) {
      const tracked = createdUsers.get(deletableUser.id);
      if (tracked && !tracked.cleaned) {
        try {
          await UserRepository.deleteUser(deletableUser.id);
          markUserAsDeleted(deletableUser.id);
        } catch (error) {
          // Ignore cleanup failures
        }
      }
    }
    deletableUser = undefined;
    deletableToken = undefined;
    credentials = undefined;
  });

  it("deve deletar o usuário logado e remover dados", async () => {
    const response = await request(app)
      .delete(`/users/${deletableUser.id}`)
      .set("Authorization", `Bearer ${deletableToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.message).toMatch(/sucesso/i);
    markUserAsDeleted(deletableUser.id);

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(401);

    deletableUser = undefined;
  });

  it("não deve deletar sem autorização", async () => {
    const response = await request(app)
      .delete(`/users/${deletableUser.id}`);

    expectUnauthorized(response);
  });

  it("não deve permitir deletar outro usuário", async () => {
    const response = await request(app)
      .delete(`/users/${adminUser.id}`)
      .set("Authorization", `Bearer ${deletableToken}`);

    expect(response.status).toBe(403);
  });

  it("deve retornar 404 quando o usuário não existir mais", async () => {
    await UserRepository.deleteUser(deletableUser.id);
    markUserAsDeleted(deletableUser.id);

    const response = await request(app)
      .delete(`/users/${deletableUser.id}`)
      .set("Authorization", `Bearer ${deletableToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBeDefined();

    deletableUser = undefined;
  });
});