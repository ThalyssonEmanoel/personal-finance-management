import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  jest
} from "@jest/globals";
import app from "../../app.js";
import { faker } from "@faker-js/faker";
import { prisma } from "../../config/prismaClient.js";
import UserRepository from "../../repositories/UserRepository.js";
import bcrypt from "bcryptjs";

jest.setTimeout(40000);

const createdUsers = new Map();

const randomEmail = () => `auth.${faker.string.alphanumeric({ length: 10, casing: "lower" })}.${Date.now()}@example.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;

const buildUserPayload = (overrides = {}) => ({
  name: overrides.name ?? `Auth Test User ${faker.number.int({ min: 1000, max: 9999 })}`,
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

const createTestUser = async (payload) => {
  const response = await request(app)
    .post("/users")
    .field("name", payload.name)
    .field("email", payload.email)
    .field("password", payload.password);
  
  expect(response.status).toBe(201);
  const user = response.body.data;
  trackUser(user.id, { email: payload.email, password: payload.password });
  return { user, credentials: payload };
};

const loginUser = async (email, password) => {
  return request(app).post("/login").send({ email, password });
};

afterAll(async () => {
  for (const [userId, info] of createdUsers.entries()) {
    if (info.cleaned) {
      continue;
    }
    try {
      await UserRepository.deleteUser(userId);
    } catch (error) {
      // Ignore cleanup failures
    }
  }
  await prisma.$disconnect();
});

describe("POST /login", () => {
  let testUser;
  let testCredentials;

  beforeAll(async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    testUser = user;
    testCredentials = credentials;
  });

  it("deve fazer login com credenciais válidas e retornar tokens e dados do usuário", async () => {
    const response = await loginUser(testCredentials.email, testCredentials.password);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    expect(response.body.data).toHaveProperty('usuario');
    
    expect(response.body.data.usuario).toMatchObject({
      id: testUser.id,
      email: testCredentials.email,
      name: testCredentials.name
    });
    expect(response.body.data.usuario).not.toHaveProperty('password');
    expect(response.body.data.usuario).not.toHaveProperty('refreshToken');
  });

  it("deve armazenar refresh token no banco de dados após login", async () => {
    const response = await loginUser(testCredentials.email, testCredentials.password);

    expect(response.status).toBe(200);
    const refreshToken = response.body.data.refreshToken;

    const userInDb = await prisma.users.findUnique({
      where: { id: testUser.id },
      select: { refreshToken: true }
    });

    expect(userInDb.refreshToken).toBe(refreshToken);
  });

  it("não deve fazer login com email inválido", async () => {
    const response = await loginUser("emailinvalido", testCredentials.password);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBeDefined();
  });

  it("não deve fazer login com senha incorreta", async () => {
    const response = await loginUser(testCredentials.email, "SenhaErrada@123");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toMatch(/inválidos/i);
  });

  it("não deve fazer login com email inexistente", async () => {
    const response = await loginUser("naoexiste@test.com", "Senha@123");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toMatch(/inválidos/i);
  });

  it("não deve fazer login com campos vazios", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: ""
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("não deve fazer login sem fornecer email", async () => {
    const response = await request(app).post("/login").send({
      password: testCredentials.password
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("não deve fazer login sem fornecer senha", async () => {
    const response = await request(app).post("/login").send({
      email: testCredentials.email
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("deve substituir refresh token anterior ao fazer novo login", async () => {
    const firstLogin = await loginUser(testCredentials.email, testCredentials.password);
    expect(firstLogin.status).toBe(200);
    const firstRefreshToken = firstLogin.body.data.refreshToken;

    // Aguardar um segundo para garantir que o timestamp do JWT seja diferente
    await new Promise(resolve => setTimeout(resolve, 1000));

    const secondLogin = await loginUser(testCredentials.email, testCredentials.password);
    expect(secondLogin.status).toBe(200);
    const secondRefreshToken = secondLogin.body.data.refreshToken;

    expect(firstRefreshToken).not.toBe(secondRefreshToken);

    const userInDb = await prisma.users.findUnique({
      where: { id: testUser.id },
      select: { refreshToken: true }
    });

    expect(userInDb.refreshToken).toBe(secondRefreshToken);
  });
});

describe("POST /logout", () => {
  let testUser;
  let testCredentials;
  let testToken;

  beforeAll(async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    testUser = user;
    testCredentials = credentials;

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    testToken = loginResponse.body.data.accessToken;
  });

  it("deve fazer logout com sucesso e remover refresh token", async () => {
    const loginResponse = await loginUser(testCredentials.email, testCredentials.password);
    expect(loginResponse.status).toBe(200);
    const userToken = loginResponse.body.data.accessToken;

    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ id: String(testUser.id) });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.message).toMatch(/sucesso/i);

    const userInDb = await prisma.users.findUnique({
      where: { id: testUser.id },
      select: { refreshToken: true }
    });

    expect(userInDb.refreshToken).toBeNull();
  });

  it("não deve fazer logout sem autenticação", async () => {
    const response = await request(app)
      .post("/logout")
      .send({ id: String(testUser.id) });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("não deve fazer logout com token inválido", async () => {
    const response = await request(app)
      .post("/logout")
      .set("Authorization", "Bearer token-invalido")
      .send({ id: String(testUser.id) });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("não deve fazer logout sem fornecer ID do usuário", async () => {
    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${testToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro ao fazer logout de usuário inexistente", async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    
    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    const userToken = loginResponse.body.data.accessToken;

    await UserRepository.deleteUser(user.id);
    markUserAsDeleted(user.id);

    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ id: String(user.id) });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });
});

describe("POST /refresh-token", () => {
  let testUser;
  let testCredentials;
  let testRefreshToken;
  let testAccessToken;

  beforeAll(async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    testUser = user;
    testCredentials = credentials;

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    testAccessToken = loginResponse.body.data.accessToken;
    testRefreshToken = loginResponse.body.data.refreshToken;
  });

  it("deve renovar access token com refresh token válido", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: testRefreshToken });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    
    // O refresh token deve permanecer o mesmo
    expect(response.body.data.refreshToken).toBe(testRefreshToken);
    
    // O access token deve existir e ser válido
    expect(response.body.data.accessToken).toBeTruthy();
    expect(typeof response.body.data.accessToken).toBe('string');
  });

  it("deve permitir usar o novo access token para acessar recursos protegidos", async () => {
    const refreshResponse = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: testRefreshToken });

    expect(refreshResponse.status).toBe(200);
    const newAccessToken = refreshResponse.body.data.accessToken;

    const userResponse = await request(app)
      .get(`/users/${testUser.id}`)
      .set("Authorization", `Bearer ${newAccessToken}`);

    expect(userResponse.status).toBe(200);
    expect(userResponse.body.data.id).toBe(testUser.id);
  });

  it("não deve renovar access token com refresh token inválido", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: "token-invalido" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toMatch(/inválido|expirado/i);
  });

  it("não deve renovar access token sem fornecer refresh token", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("não deve renovar access token com refresh token vazio", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("não deve renovar access token após logout", async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    
    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    const userRefreshToken = loginResponse.body.data.refreshToken;
    const userAccessToken = loginResponse.body.data.accessToken;

    const logoutResponse = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send({ id: String(user.id) });

    expect(logoutResponse.status).toBe(200);

    const refreshResponse = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: userRefreshToken });

    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.body.error).toBe(true);
  });

  it("não deve renovar access token de usuário deletado", async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    
    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    const userRefreshToken = loginResponse.body.data.refreshToken;

    await UserRepository.deleteUser(user.id);
    markUserAsDeleted(user.id);

    const refreshResponse = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: userRefreshToken });

    expect(refreshResponse.status).toBe(404);
    expect(refreshResponse.body.error).toBe(true);
  });

  it("não deve renovar access token que foi substituído por novo login", async () => {
    const firstLogin = await loginUser(testCredentials.email, testCredentials.password);
    expect(firstLogin.status).toBe(200);
    const firstRefreshToken = firstLogin.body.data.refreshToken;

    // Aguardar para garantir timestamp diferente
    await new Promise(resolve => setTimeout(resolve, 1000));

    const secondLogin = await loginUser(testCredentials.email, testCredentials.password);
    expect(secondLogin.status).toBe(200);
    const secondRefreshToken = secondLogin.body.data.refreshToken;

    // O primeiro refresh token não deve funcionar mais pois foi substituído
    const refreshResponse = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: firstRefreshToken });

    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.body.error).toBe(true);

    // O segundo refresh token deve funcionar
    const refreshResponse2 = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: secondRefreshToken });

    expect(refreshResponse2.status).toBe(200);
  });
});

describe("Fluxo completo de autenticação", () => {
  it("deve realizar ciclo completo: login -> uso do token -> refresh -> logout", async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());

    // 1. Login
    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    const { accessToken, refreshToken } = loginResponse.body.data;

    // 2. Usar access token para acessar recurso protegido
    const userResponse = await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(userResponse.status).toBe(200);
    expect(userResponse.body.data.id).toBe(user.id);

    // 3. Renovar access token
    const refreshResponse = await request(app)
      .post("/refresh-token")
      .send({ refreshToken });
    expect(refreshResponse.status).toBe(200);
    const newAccessToken = refreshResponse.body.data.accessToken;

    // 4. Usar novo access token
    const userResponse2 = await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${newAccessToken}`);
    expect(userResponse2.status).toBe(200);

    // 5. Logout
    const logoutResponse = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${newAccessToken}`)
      .send({ id: String(user.id) });
    expect(logoutResponse.status).toBe(200);

    // 6. Verificar que refresh token não funciona mais
    const refreshAfterLogout = await request(app)
      .post("/refresh-token")
      .send({ refreshToken });
    expect(refreshAfterLogout.status).toBe(401);
  });

  it("deve permitir múltiplos logins e manter apenas o último refresh token", async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());

    const login1 = await loginUser(credentials.email, credentials.password);
    expect(login1.status).toBe(200);
    const refreshToken1 = login1.body.data.refreshToken;

    // Aguardar para garantir timestamp diferente
    await new Promise(resolve => setTimeout(resolve, 1000));

    const login2 = await loginUser(credentials.email, credentials.password);
    expect(login2.status).toBe(200);
    const refreshToken2 = login2.body.data.refreshToken;

    // Aguardar para garantir timestamp diferente
    await new Promise(resolve => setTimeout(resolve, 1000));

    const login3 = await loginUser(credentials.email, credentials.password);
    expect(login3.status).toBe(200);
    const refreshToken3 = login3.body.data.refreshToken;

    // Verificar que os tokens são diferentes
    expect(refreshToken1).not.toBe(refreshToken2);
    expect(refreshToken2).not.toBe(refreshToken3);

    // Apenas o último refresh token deve funcionar
    const refresh1 = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: refreshToken1 });
    expect(refresh1.status).toBe(401);

    const refresh2 = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: refreshToken2 });
    expect(refresh2.status).toBe(401);

    const refresh3 = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: refreshToken3 });
    expect(refresh3.status).toBe(200);

    // Verificar que o refresh token no banco é o último
    const userInDb = await prisma.users.findUnique({
      where: { id: user.id },
      select: { refreshToken: true }
    });
    expect(userInDb.refreshToken).toBe(refreshToken3);
  });
});

describe("Segurança de autenticação", () => {
  let testUser;
  let testCredentials;
  let testToken;

  beforeAll(async () => {
    const { user, credentials } = await createTestUser(buildUserPayload());
    testUser = user;
    testCredentials = credentials;

    const loginResponse = await loginUser(credentials.email, credentials.password);
    expect(loginResponse.status).toBe(200);
    testToken = loginResponse.body.data.accessToken;
  });

  it("não deve expor senha no retorno do login", async () => {
    const response = await loginUser(testCredentials.email, testCredentials.password);

    expect(response.status).toBe(200);
    expect(response.body.data.usuario).not.toHaveProperty('password');
    expect(response.body.data.usuario).not.toHaveProperty('senha');
  });

  it("não deve expor refresh token no objeto usuario", async () => {
    const response = await loginUser(testCredentials.email, testCredentials.password);

    expect(response.status).toBe(200);
    expect(response.body.data.usuario).not.toHaveProperty('refreshToken');
  });

  it("deve armazenar senha criptografada no banco de dados", async () => {
    const userInDb = await prisma.users.findUnique({
      where: { id: testUser.id },
      select: { password: true }
    });

    expect(userInDb.password).not.toBe(testCredentials.password);
    expect(userInDb.password).toMatch(/^\$2[ayb]\$.{56}$/); // Formato bcrypt
  });

  it("deve validar que a senha armazenada corresponde à senha original", async () => {
    const userInDb = await prisma.users.findUnique({
      where: { id: testUser.id },
      select: { password: true }
    });

    const isValid = await bcrypt.compare(testCredentials.password, userInDb.password);
    expect(isValid).toBe(true);
  });

  it("não deve aceitar access token como refresh token", async () => {
    const loginResponse = await loginUser(testCredentials.email, testCredentials.password);
    expect(loginResponse.status).toBe(200);
    const accessToken = loginResponse.body.data.accessToken;

    const response = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: accessToken });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve rejeitar tokens com formato inválido", async () => {
    const invalidTokens = [
      "invalid.token.format",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid",
      "Bearer token",
      "123456789",
      "null",
      "undefined"
    ];

    for (const invalidToken of invalidTokens) {
      const response = await request(app)
        .post("/refresh-token")
        .send({ refreshToken: invalidToken });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    }
  });
});
