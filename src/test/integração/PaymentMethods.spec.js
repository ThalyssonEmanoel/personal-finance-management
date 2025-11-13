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

jest.setTimeout(40000);

let testUserId;
let testToken;
let secondaryUserId;
let secondaryToken;

// Tracking IDs
const createdPaymentMethodIds = new Set();
const createdAccountIds = new Set();
const createdUserIds = new Set();

const adminCredentials = {
  email: "thalysson140105@gmail.com",
  password: "Senha@12345"
};

// Helper functions
const randomEmail = () => `payment${faker.number.int({ min: 1000, max: 9999 })}@test.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const buildUserPayload = () => ({
  name: `Payment User ${faker.number.int({ min: 1000, max: 9999 })}`,
  email: randomEmail(),
  password: randomPassword()
});

const randomPaymentMethodName = () => `Método ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomAccountName = () => `Conta ${faker.number.int({ min: 1000, max: 9999 })}`;

const loginUser = async (email, password) => (
  request(app).post("/login").send({ email, password })
);

const createPaymentMethodForUser = async (overrides = {}) => {
  const payload = {
    name: overrides.name ?? randomPaymentMethodName()
  };

  const response = await request(app)
    .post("/payment-methods")
    .set("Authorization", `Bearer ${overrides.token ?? testToken}`)
    .send(payload);

  if (response.status !== 201) {
    throw new Error(`Failed to create payment method: ${JSON.stringify(response.body)}`);
  }

  const paymentMethod = response.body.data;
  createdPaymentMethodIds.add(paymentMethod.id);
  return paymentMethod;
};

const createAccountForUser = async (overrides = {}) => {
  const requestBuilder = request(app)
    .post("/account")
    .set("Authorization", `Bearer ${overrides.token ?? testToken}`)
    .query({ userId: overrides.userId ?? testUserId })
    .field("name", overrides.name ?? randomAccountName())
    .field("type", overrides.type ?? "conta_corrente")
    .field("balance", (overrides.balance ?? 5000).toFixed(2));

  if (overrides.paymentMethodIds && overrides.paymentMethodIds.length > 0) {
    requestBuilder.field("paymentMethodIds", overrides.paymentMethodIds.join(","));
  }

  const response = await requestBuilder;

  if (response.status !== 201) {
    throw new Error(`Failed to create account: ${JSON.stringify(response.body)}`);
  }

  const account = response.body.data;
  createdAccountIds.add(account.id);
  return account;
};

// Base test data
let basePaymentMethod;

beforeAll(async () => {
  // Login admin user
  const loginResponse = await loginUser(adminCredentials.email, adminCredentials.password);
  expect(loginResponse.status).toBe(200);
  testToken = loginResponse.body.data.accessToken;
  testUserId = loginResponse.body.data.usuario?.id ?? loginResponse.body.data.user?.id;

  if (!testUserId) {
    throw new Error("Failed to get user ID from login response");
  }

  // Clean up existing data
  try {
    await prisma.paymentMethods.deleteMany({ where: { name: { contains: "Método" } } });
  } catch (error) {
    console.error("Error cleaning up:", error);
  }

  // Create secondary user
  const secondaryPayload = buildUserPayload();
  const createSecondaryResponse = await request(app)
    .post("/users")
    .field("name", secondaryPayload.name)
    .field("email", secondaryPayload.email)
    .field("password", secondaryPayload.password);

  expect(createSecondaryResponse.status).toBe(201);
  secondaryUserId = createSecondaryResponse.body.data.id;
  createdUserIds.add(secondaryUserId);

  const secondaryLoginResponse = await loginUser(secondaryPayload.email, secondaryPayload.password);
  expect(secondaryLoginResponse.status).toBe(200);
  secondaryToken = secondaryLoginResponse.body.data.accessToken;

  // Create base payment method
  basePaymentMethod = await createPaymentMethodForUser({
    name: "PIX Base"
  });
});

afterAll(async () => {
  // Delete accounts (will cascade delete account-payment-methods)
  try {
    if (createdAccountIds.size > 0) {
      await prisma.accounts.deleteMany({
        where: { id: { in: Array.from(createdAccountIds) } }
      });
    }
  } catch (error) {
    console.error("Error deleting accounts:", error);
  }

  // Delete payment methods
  try {
    if (createdPaymentMethodIds.size > 0) {
      await prisma.paymentMethods.deleteMany({
        where: { id: { in: Array.from(createdPaymentMethodIds) } }
      });
    }
  } catch (error) {
    console.error("Error deleting payment methods:", error);
  }

  // Delete secondary user's data
  for (const userId of createdUserIds) {
    try {
      await prisma.accounts.deleteMany({ where: { userId } });
      await prisma.users.delete({ where: { id: userId } });
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
    }
  }

  await prisma.$disconnect();
});

describe("GET /payment-methods", () => {
  it("deve listar métodos de pagamento", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    
    const paymentMethod = response.body.data.find(pm => pm.id === basePaymentMethod.id);
    expect(paymentMethod).toBeDefined();
    expect(paymentMethod.name).toBe(basePaymentMethod.name);
    expect(paymentMethod._count).toBeDefined();
  });

  it("deve filtrar método de pagamento por ID", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: basePaymentMethod.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(basePaymentMethod.id);
  });

  it("deve filtrar método de pagamento por nome", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ name: "PIX" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Todos os resultados devem conter "PIX" no nome
    response.body.data.forEach(pm => {
      expect(pm.name).toContain("PIX");
    });
  });

  it("deve respeitar paginação com page e limit", async () => {
    // Criar métodos adicionais para testar paginação
    await createPaymentMethodForUser({ name: "Débito Extra 1" });
    await createPaymentMethodForUser({ name: "Crédito Extra 1" });

    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ page: 1, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
  });

  it("deve retornar metadados com total e paginação", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.total).toBeDefined();
    expect(response.body.page).toBeDefined();
  });

  it("deve retornar 404 quando não encontrar métodos", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ name: "MetodoInexistente999999" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get("/payment-methods");

    expect(response.status).toBe(401);
  });

  it("deve validar que ID seja um número positivo", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: -1 });

    expect(response.status).toBe(400);
  });

  it("deve validar que page seja um número positivo", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ page: 0 });

    expect(response.status).toBe(400);
  });

  it("deve validar que limit seja um número positivo", async () => {
    const response = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ limit: -5 });

    expect(response.status).toBe(400);
  });
});

describe("GET /payment-methods/:id", () => {
  it("deve buscar método de pagamento por ID", async () => {
    const response = await request(app)
      .get(`/payment-methods/${basePaymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.id).toBe(basePaymentMethod.id);
    expect(response.body.data.name).toBe(basePaymentMethod.name);
    expect(response.body.data._count).toBeDefined();
  });

  it("deve retornar 404 ao buscar método inexistente", async () => {
    const response = await request(app)
      .get("/payment-methods/999999")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro ao buscar com ID inválido", async () => {
    const response = await request(app)
      .get("/payment-methods/invalid-id")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(400);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get(`/payment-methods/${basePaymentMethod.id}`);

    expect(response.status).toBe(401);
  });
});

describe("POST /payment-methods", () => {
  it("deve criar um método de pagamento", async () => {
    const paymentMethodData = {
      name: "Cartão de Crédito Visa"
    };

    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send(paymentMethodData);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe(paymentMethodData.name);
    expect(response.body.data.id).toBeDefined();

    createdPaymentMethodIds.add(response.body.data.id);
  });

  it("deve permitir criar métodos com nomes similares", async () => {
    const paymentMethodData = {
      name: "Método Similar Test"
    };

    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send(paymentMethodData);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    
    createdPaymentMethodIds.add(response.body.data.id);
  });

  it("deve recusar criar método sem nome", async () => {
    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("deve recusar criar método com nome vazio", async () => {
    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "" });

    expect(response.status).toBe(400);
  });

  it("deve recusar criar método com nome apenas numérico", async () => {
    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "12345" });

    expect(response.status).toBe(400);
  });

  it("deve recusar criação sem token", async () => {
    const response = await request(app)
      .post("/payment-methods")
      .send({ name: "Débito Test" });

    expect(response.status).toBe(401);
  });

  it("deve permitir nomes com caracteres especiais", async () => {
    const paymentMethodData = {
      name: "PIX - Transferência Instantânea"
    };

    const response = await request(app)
      .post("/payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .send(paymentMethodData);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(paymentMethodData.name);

    createdPaymentMethodIds.add(response.body.data.id);
  });
});

describe("PATCH /payment-methods/:id", () => {
  it("deve atualizar nome do método de pagamento", async () => {
    const paymentMethod = await createPaymentMethodForUser({
      name: "Método para Atualizar"
    });

    const updateData = {
      name: "Método Atualizado"
    };

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.id).toBe(paymentMethod.id);

    // Verificar se foi realmente atualizado
    const checkResponse = await request(app)
      .get(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(checkResponse.body.data.name).toBe(updateData.name);
  });

  it("deve retornar 404 ao atualizar método inexistente", async () => {
    const response = await request(app)
      .patch("/payment-methods/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve permitir atualização com nomes diferentes", async () => {
    const paymentMethod = await createPaymentMethodForUser({
      name: "Método Único"
    });

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "Método Único Atualizado" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe("Método Único Atualizado");
  });

  it("deve recusar atualização com nome vazio", async () => {
    const paymentMethod = await createPaymentMethodForUser();

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "" });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização com nome apenas numérico", async () => {
    const paymentMethod = await createPaymentMethodForUser();

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "99999" });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização sem dados válidos", async () => {
    const paymentMethod = await createPaymentMethodForUser();

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização sem token", async () => {
    const paymentMethod = await createPaymentMethodForUser();

    const response = await request(app)
      .patch(`/payment-methods/${paymentMethod.id}`)
      .send({ name: "Teste" });

    expect(response.status).toBe(401);
  });

  it("deve retornar erro ao atualizar com ID inválido", async () => {
    const response = await request(app)
      .patch("/payment-methods/invalid-id")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "Teste" });

    expect(response.status).toBe(400);
  });
});

describe("DELETE /payment-methods/:id", () => {
  it("deve deletar um método de pagamento não utilizado", async () => {
    const paymentMethod = await createPaymentMethodForUser({
      name: "Método para Deletar"
    });

    const response = await request(app)
      .delete(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.message).toContain("excluída com sucesso");

    // Verificar que foi deletado
    const checkResponse = await request(app)
      .get(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(checkResponse.status).toBe(404);

    createdPaymentMethodIds.delete(paymentMethod.id);
  });

  it("deve retornar 404 ao deletar método inexistente", async () => {
    const response = await request(app)
      .delete("/payment-methods/999999")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar deleção de método usado em contas", async () => {
    const paymentMethod = await createPaymentMethodForUser({
      name: "Método em Uso"
    });

    // Criar conta usando este método
    await createAccountForUser({
      name: "Conta Test",
      paymentMethodIds: [paymentMethod.id]
    });

    const response = await request(app)
      .delete(`/payment-methods/${paymentMethod.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toContain("sendo utilizada");
  });

  it("deve recusar deleção sem token", async () => {
    const paymentMethod = await createPaymentMethodForUser();

    const response = await request(app)
      .delete(`/payment-methods/${paymentMethod.id}`);

    expect(response.status).toBe(401);
  });

  it("deve retornar erro ao deletar com ID inválido", async () => {
    const response = await request(app)
      .delete("/payment-methods/invalid-id")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(400);
  });
});

describe("GET /account-payment-methods", () => {
  let testAccount;
  let testPaymentMethod;

  beforeAll(async () => {
    testPaymentMethod = await createPaymentMethodForUser({
      name: "PIX para Teste de Associação"
    });

    testAccount = await createAccountForUser({
      name: "Conta para Teste de Associação",
      balance: 1000,
      paymentMethodIds: [testPaymentMethod.id]
    });
  });

  it("deve listar associações entre contas e métodos de pagamento", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    const association = response.body.data.find(
      apm => apm.accountId === testAccount.id && apm.paymentMethodId === testPaymentMethod.id
    );
    
    expect(association).toBeDefined();
    expect(association.account).toBeDefined();
    expect(association.paymentMethod).toBeDefined();
  });

  it("deve filtrar associações por accountId", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ accountId: testAccount.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    
    response.body.data.forEach(apm => {
      expect(apm.accountId).toBe(testAccount.id);
    });
  });

  it("deve filtrar associações por paymentMethodId", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ paymentMethodId: testPaymentMethod.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    
    response.body.data.forEach(apm => {
      expect(apm.paymentMethodId).toBe(testPaymentMethod.id);
    });
  });

  it("deve filtrar associações por nome da conta", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ accountName: "Associação" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    
    response.body.data.forEach(apm => {
      expect(apm.account.name).toContain("Associação");
    });
  });

  it("deve filtrar associações por nome do método de pagamento", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ paymentMethodName: "PIX" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    
    response.body.data.forEach(apm => {
      expect(apm.paymentMethod.name).toContain("PIX");
    });
  });

  it("deve respeitar paginação", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ page: 1, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it("deve retornar metadados com total e paginação", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.total).toBeDefined();
    expect(response.body.page).toBeDefined();
  });

  it("deve retornar 404 quando não encontrar associações", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ accountId: 999999 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get("/account-payment-methods");

    expect(response.status).toBe(401);
  });

  it("deve validar que accountId seja número positivo", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ accountId: -1 });

    expect(response.status).toBe(400);
  });

  it("deve validar que paymentMethodId seja número positivo", async () => {
    const response = await request(app)
      .get("/account-payment-methods")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ paymentMethodId: -1 });

    expect(response.status).toBe(400);
  });
});
