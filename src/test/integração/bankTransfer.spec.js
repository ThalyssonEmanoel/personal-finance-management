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
const createdTransferIds = new Set();
const createdAccountIds = new Set();
const createdPaymentMethodIds = new Set();
const createdUserIds = new Set();

const adminCredentials = {
  email: "dev12AB@gmail.com",
  password: "Senha@12345"
};

// Helper functions
const randomEmail = () => `transfer${faker.number.int({ min: 1000, max: 9999 })}@test.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const buildUserPayload = () => ({
  name: `Transfer User ${faker.number.int({ min: 1000, max: 9999 })}`,
  email: randomEmail(),
  password: randomPassword()
});

const randomAccountName = () => `Conta ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomPaymentMethodName = () => `Método ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomAmount = () => Number(faker.number.float({ min: 100, max: 2000, precision: 0.01 }).toFixed(2));
const formatDate = (date) => date.toISOString().split("T")[0];
const generateDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
};

const loginUser = async (email, password) => (
  request(app).post("/login").send({ email, password })
);

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

const createBankTransferForUser = async (overrides = {}) => {
  const payload = {
    amount: overrides.amount ?? randomAmount(),
    transfer_date: overrides.transfer_date ?? generateDate(),
    description: overrides.description ?? `Transferência ${faker.number.int({ min: 1000, max: 9999 })}`,
    sourceAccountId: overrides.sourceAccountId,
    destinationAccountId: overrides.destinationAccountId,
    paymentMethodId: overrides.paymentMethodId
  };

  const response = await request(app)
    .post("/BankTransfer")
    .set("Authorization", `Bearer ${overrides.token ?? testToken}`)
    .query({ userId: overrides.userId ?? testUserId })
    .send(payload);

  if (response.status !== 201) {
    throw new Error(`Failed to create bank transfer: ${JSON.stringify(response.body)}`);
  }

  const transfer = response.body.data;
  createdTransferIds.add(transfer.id);
  return transfer;
};

// Base test data
let baseSourceAccount;
let baseDestinationAccount;
let basePaymentMethod;
let baseTransfer;

beforeAll(async () => {
  // Login admin user
  const loginResponse = await loginUser(adminCredentials.email, adminCredentials.password);
  expect(loginResponse.status).toBe(200);
  testToken = loginResponse.body.data.accessToken;
  testUserId = loginResponse.body.data.usuario?.id ?? loginResponse.body.data.user?.id;

  if (!testUserId) {
    throw new Error("Failed to retrieve admin user ID from login response");
  }

  // Clean up existing data
  try {
    await prisma.bankTransfers.deleteMany({ where: { userId: testUserId } });
  } catch (error) {
    console.error("Error cleaning up existing bank transfers:", error);
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
    name: "PIX Principal"
  });

  // Create base accounts with payment method associated
  baseSourceAccount = await createAccountForUser({
    name: "Conta Origem Principal",
    balance: 10000,
    type: "conta_corrente",
    paymentMethodIds: [basePaymentMethod.id]
  });

  baseDestinationAccount = await createAccountForUser({
    name: "Conta Destino Principal",
    balance: 5000,
    type: "poupanca",
    paymentMethodIds: [basePaymentMethod.id]
  });

  // Create base transfer
  baseTransfer = await createBankTransferForUser({
    amount: 500,
    transfer_date: generateDate(-5),
    description: "Transferência Base de Teste",
    sourceAccountId: baseSourceAccount.id,
    destinationAccountId: baseDestinationAccount.id,
    paymentMethodId: basePaymentMethod.id
  });
});

afterAll(async () => {
  // Delete transfers
  try {
    if (createdTransferIds.size > 0) {
      await prisma.bankTransfers.deleteMany({
        where: { id: { in: Array.from(createdTransferIds) } }
      });
    }
  } catch (error) {
    console.error("Error deleting bank transfers:", error);
  }

  // Delete accounts
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

  // Delete secondary user's data before deleting user
  for (const userId of createdUserIds) {
    try {
      await prisma.bankTransfers.deleteMany({ where: { userId } });
      await prisma.accounts.deleteMany({ where: { userId } });
      await prisma.users.delete({ where: { id: userId } });
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
    }
  }

  await prisma.$disconnect();
});

describe("GET /BankTransfer", () => {
  it("deve listar transferências do usuário", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Verificar estrutura da transferência
    const transfer = response.body.data[0];
    expect(transfer.id).toBeDefined();
    expect(transfer.amount).toBeDefined();
    expect(transfer.transfer_date).toBeDefined();
    expect(transfer.sourceAccount).toBeDefined();
    expect(transfer.destinationAccount).toBeDefined();
    expect(transfer.paymentMethod).toBeDefined();
  });

  it("deve filtrar transferências por ID", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, id: baseTransfer.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(baseTransfer.id);
  });

  it("deve filtrar transferências por conta de origem", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, sourceAccountId: baseSourceAccount.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.every(t => t.sourceAccountId === baseSourceAccount.id)).toBe(true);
  });

  it("deve filtrar transferências por conta de destino", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, destinationAccountId: baseDestinationAccount.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.every(t => t.destinationAccountId === baseDestinationAccount.id)).toBe(true);
  });

  it("deve filtrar transferências por método de pagamento", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, paymentMethodId: basePaymentMethod.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.every(t => t.paymentMethodId === basePaymentMethod.id)).toBe(true);
  });

  it("deve filtrar transferências por data", async () => {
    const transferDate = generateDate(-5);
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, transfer_date: transferDate });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("deve respeitar paginação com page e limit", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, page: 1, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it("deve retornar metadados com total e paginação", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.total).toBeDefined();
    expect(response.body.page).toBeDefined();
  });

  it("deve retornar erro ao omitir userId", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(400);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .query({ userId: testUserId });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir acesso às transferências de outro usuário", async () => {
    const response = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(403);
  });
});

describe("POST /BankTransfer", () => {
  it("deve criar uma transferência bancária", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 5000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transferData = {
      amount: 300,
      transfer_date: generateDate(),
      description: "Nova Transferência Teste",
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(Number(response.body.data.amount)).toBe(transferData.amount);
    expect(response.body.data.description).toBe(transferData.description);
    expect(response.body.data.sourceAccountId).toBe(transferData.sourceAccountId);
    expect(response.body.data.destinationAccountId).toBe(transferData.destinationAccountId);

    createdTransferIds.add(response.body.data.id);
  });

  it("deve atualizar saldos das contas após transferência", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 500,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transferAmount = 400;

    await createBankTransferForUser({
      amount: transferAmount,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    // Verificar saldos atualizados
    const sourceUpdated = await prisma.accounts.findUnique({ where: { id: sourceAccount.id } });
    const destUpdated = await prisma.accounts.findUnique({ where: { id: destAccount.id } });

    expect(Number(sourceUpdated.balance)).toBe(2000 - transferAmount);
    expect(Number(destUpdated.balance)).toBe(500 + transferAmount);
  });

  it("deve recusar transferência com saldo insuficiente", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 100,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 500,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transferData = {
      amount: 500,
      transfer_date: generateDate(),
      description: "Transferência com saldo insuficiente",
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toContain("Saldo insuficiente");
  });

  it("deve recusar transferência de conta não pertencente ao usuário (origem)", async () => {
    // Criar conta para usuário secundário
    const secondaryAccount = await createAccountForUser({
      userId: secondaryUserId,
      token: secondaryToken,
      balance: 5000
    });

    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      description: "Transferência de conta alheia",
      sourceAccountId: secondaryAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toContain("conta de origem");
  });

  it("deve recusar transferência de conta não pertencente ao usuário (destino)", async () => {
    // Criar conta para usuário secundário
    const secondaryAccount = await createAccountForUser({
      userId: secondaryUserId,
      token: secondaryToken,
      balance: 5000
    });

    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      description: "Transferência para conta alheia",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: secondaryAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toContain("conta de destino");
  });

  it("deve recusar transferência com valor zero", async () => {
    const transferData = {
      amount: 0,
      transfer_date: generateDate(),
      description: "Transferência com valor zero",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(400);
  });

  it("deve recusar transferência com valor negativo", async () => {
    const transferData = {
      amount: -100,
      transfer_date: generateDate(),
      description: "Transferência com valor negativo",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(400);
  });

  it("deve recusar transferência com data inválida", async () => {
    const transferData = {
      amount: 200,
      transfer_date: "invalid-date",
      description: "Transferência com data inválida",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(400);
  });

  it("deve permitir criar transferência sem descrição", async () => {
    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(201);
    expect(response.body.data.description).toBeNull();
    createdTransferIds.add(response.body.data.id);
  });

  it("deve exigir userId na query", async () => {
    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      description: "Transferência sem userId",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .send(transferData);

    expect(response.status).toBe(400);
  });

  it("deve recusar criação sem token", async () => {
    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      description: "Transferência sem token",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir criação para outro usuário", async () => {
    const transferData = {
      amount: 200,
      transfer_date: generateDate(),
      description: "Transferência de outro usuário",
      sourceAccountId: baseSourceAccount.id,
      destinationAccountId: baseDestinationAccount.id,
      paymentMethodId: basePaymentMethod.id
    };

    const response = await request(app)
      .post("/BankTransfer")
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ userId: testUserId })
      .send(transferData);

    expect(response.status).toBe(403);
  });
});

describe("PATCH /BankTransfer/:id", () => {
  it("deve atualizar descrição da transferência", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 3000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 150,
      description: "Descrição Original",
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ description: "Descrição Atualizada" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.description).toBe("Descrição Atualizada");
  });

  it("deve atualizar valor da transferência e ajustar saldos", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 5000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 200,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    // Saldos após primeira transferência: source = 4800, dest = 2200

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ amount: 300 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Number(response.body.data.amount)).toBe(300);

    // Verificar saldos atualizados: diferença de +100
    // source: 4800 - 100 = 4700, dest: 2200 + 100 = 2300
    const sourceUpdated = await prisma.accounts.findUnique({ where: { id: sourceAccount.id } });
    const destUpdated = await prisma.accounts.findUnique({ where: { id: destAccount.id } });

    expect(Number(sourceUpdated.balance)).toBe(4700);
    expect(Number(destUpdated.balance)).toBe(2300);
  });

  it("deve atualizar data da transferência", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 3000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 150,
      transfer_date: generateDate(-10),
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const newDate = generateDate(-5);
    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ transfer_date: newDate });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(formatDate(new Date(response.body.data.transfer_date))).toBe(newDate);
  });

  it("deve atualizar múltiplos campos simultaneamente", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 4000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1500,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 250,
      description: "Original",
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({
        description: "Atualizada Completa",
        transfer_date: generateDate(-3)
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.description).toBe("Atualizada Completa");
  });

  it("deve recusar atualização com saldo insuficiente", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 500,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    // Tentar aumentar para valor maior que o disponível
    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ amount: 2000 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toContain("Saldo insuficiente");
  });

  it("deve retornar 404 ao atualizar transferência inexistente", async () => {
    const response = await request(app)
      .patch("/BankTransfer/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId })
      .send({ description: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar atualização com valor zero", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ amount: 0 });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização com valor negativo", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ amount: -50 });

    expect(response.status).toBe(400);
  });

  it("deve exigir userId na query", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id })
      .send({ description: "Teste" });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização sem token", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ description: "Teste" });

    expect(response.status).toBe(401);
  });

  it("deve impedir alteração por outro usuário", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .patch(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: transfer.id, userId: testUserId })
      .send({ description: "Tentativa de Alteração" });

    expect(response.status).toBe(403);
  });
});

describe("DELETE /BankTransfer/:id", () => {
  it("deve deletar uma transferência e reverter saldos", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 3000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1500,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 400,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    // Saldos após transferência: source = 2600, dest = 1900

    const response = await request(app)
      .delete(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id, userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.message).toContain("excluída com sucesso");

    // Verificar saldos revertidos: source = 3000, dest = 1500
    const sourceUpdated = await prisma.accounts.findUnique({ where: { id: sourceAccount.id } });
    const destUpdated = await prisma.accounts.findUnique({ where: { id: destAccount.id } });

    expect(Number(sourceUpdated.balance)).toBe(3000);
    expect(Number(destUpdated.balance)).toBe(1500);

    // Verificar que foi deletada
    const checkResponse = await request(app)
      .get("/BankTransfer")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, id: transfer.id });

    expect(checkResponse.body.data.length).toBe(0);
    createdTransferIds.delete(transfer.id);
  });

  it("deve retornar 404 ao deletar transferência inexistente", async () => {
    const response = await request(app)
      .delete("/BankTransfer/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro quando o id for inválido", async () => {
    const response = await request(app)
      .delete("/BankTransfer/invalid-id")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: "invalid-id", userId: testUserId });

    expect(response.status).toBe(400);
  });

  it("deve recusar deleção sem token", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .delete(`/BankTransfer/${transfer.id}`)
      .query({ id: transfer.id, userId: testUserId });

    expect(response.status).toBe(401);
  });

  it("deve impedir deleção por outro usuário", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .delete(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: transfer.id, userId: testUserId });

    expect(response.status).toBe(403);
  });

  it("deve exigir userId na query", async () => {
    const sourceAccount = await createAccountForUser({ 
      balance: 2000,
      paymentMethodIds: [basePaymentMethod.id]
    });
    const destAccount = await createAccountForUser({ 
      balance: 1000,
      paymentMethodIds: [basePaymentMethod.id]
    });

    const transfer = await createBankTransferForUser({
      amount: 100,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      paymentMethodId: basePaymentMethod.id
    });

    const response = await request(app)
      .delete(`/BankTransfer/${transfer.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transfer.id });

    expect(response.status).toBe(400);
  });
});
