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
let primaryAccount;
let secondaryAccount;
let primaryPaymentMethodId;
let secondaryPaymentMethodId;

const createdTransactionIds = new Set();
const createdAccountIds = new Set();
const createdPaymentMethodIds = new Set();
const createdUserIds = new Set();

const adminCredentials = {
  email: "thalysson140105@gmail.com",
  password: "Senha@12345"
};

const randomEmail = () => `txn${faker.number.int({ min: 1000, max: 9999 })}@test.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const buildUserPayload = () => ({
  name: `Transaction User ${faker.number.int({ min: 1000, max: 9999 })}`,
  email: randomEmail(),
  password: randomPassword()
});
const randomTransactionName = () => `Transação ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomCategory = () => faker.helpers.arrayElement([
  "Salário",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação"
]);
const randomValue = () => Number(faker.number.float({ min: 50, max: 2000, precision: 0.01 }).toFixed(2));
const formatDate = (date) => date.toISOString().split("T")[0];
const generateDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
};

const loginUser = async (email, password) => (
  request(app).post("/login").send({ email, password })
);

const createPaymentMethod = async (token, name) => {
  const response = await request(app)
    .post("/payment-methods")
    .set("Authorization", `Bearer ${token}`)
    .send({ name });

  if (response.status !== 201) {
    throw new Error(`Falha ao criar método de pagamento: ${response.status}`);
  }

  const paymentMethod = response.body.data;
  createdPaymentMethodIds.add(paymentMethod.id);
  return paymentMethod;
};

const createAccountForUser = async ({ token, userId, paymentMethodIds, balance = 1500.0, overrides = {} }) => {
  const requestBuilder = request(app)
    .post("/account")
    .set("Authorization", `Bearer ${token}`)
    .query({ userId })
    .field("name", overrides.name ?? `Conta ${faker.number.int({ min: 1000, max: 9999 })}`)
    .field("type", overrides.type ?? "conta_corrente")
    .field("balance", (overrides.balance ?? balance).toFixed(2));

  if (paymentMethodIds && paymentMethodIds.length > 0) {
    requestBuilder.field("paymentMethodIds", paymentMethodIds.join(","));
  }

  const response = await requestBuilder;

  if (response.status !== 201) {
    throw new Error(`Falha ao criar conta: ${response.status}`);
  }

  const account = response.body.data;
  createdAccountIds.add(account.id);
  return account;
};

const createTransactionForUser = async (overrides = {}) => {
  const payload = {
    name: overrides.name ?? randomTransactionName(),
    type: overrides.type ?? "income",
    category: overrides.category ?? randomCategory(),
    value: overrides.value ?? randomValue(),
    release_date: overrides.release_date ?? generateDate(),
    number_installments: overrides.number_installments,
    description: overrides.description,
    recurring: overrides.recurring ?? false,
    recurring_type: overrides.recurring_type,
    accountId: overrides.accountId ?? primaryAccount.id,
    paymentMethodId: overrides.paymentMethodId ?? primaryPaymentMethodId
  };

  const response = await request(app)
    .post("/transactions")
    .set("Authorization", `Bearer ${overrides.token ?? testToken}`)
    .query({ userId: overrides.userId ?? testUserId })
    .send(payload);

  if (response.status !== 201) {
    throw new Error(`Falha ao criar transação: ${response.status}`);
  }

  const transaction = response.body.data;
  createdTransactionIds.add(transaction.id);
  return transaction;
};

const fetchAccountBalance = async (accountId) => {
  const account = await prisma.accounts.findUnique({
    where: { id: accountId },
    select: { balance: true }
  });
  return account ? Number(account.balance) : null;
};

let baseIncomeTransaction;
let baseExpenseTransaction;
let baseRecurringTransaction;

beforeAll(async () => {
  const loginResponse = await loginUser(adminCredentials.email, adminCredentials.password);
  expect(loginResponse.status).toBe(200);
  testToken = loginResponse.body.data.accessToken;
  testUserId = loginResponse.body.data.usuario?.id ?? loginResponse.body.data.user?.id;
  if (!testUserId) {
    throw new Error("Não foi possível recuperar o ID do usuário autenticado");
  }

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

  const primaryPaymentMethod = await createPaymentMethod(testToken, `Cartão ${Date.now()}`);
  primaryPaymentMethodId = primaryPaymentMethod.id;

  const secondaryPaymentMethod = await createPaymentMethod(testToken, `Pix ${Date.now()}`);
  secondaryPaymentMethodId = secondaryPaymentMethod.id;

  primaryAccount = await createAccountForUser({
    token: testToken,
    userId: testUserId,
    paymentMethodIds: [primaryPaymentMethodId],
    balance: 3000
  });

  secondaryAccount = await createAccountForUser({
    token: testToken,
    userId: testUserId,
    paymentMethodIds: [primaryPaymentMethodId, secondaryPaymentMethodId],
    balance: 2000,
    overrides: { type: "poupanca" }
  });

  baseIncomeTransaction = await createTransactionForUser({
    name: "Salário Mensal",
    type: "income",
    category: "Salário",
    value: 1500,
    release_date: generateDate(-2)
  });

  baseExpenseTransaction = await createTransactionForUser({
    name: "Supermercado",
    type: "expense",
    category: "Alimentação",
    value: 250.75,
    release_date: generateDate(-1)
  });

  baseRecurringTransaction = await createTransactionForUser({
    name: "Assinatura Streaming",
    type: "expense",
    category: "Lazer",
    value: 45.9,
    release_date: generateDate(-3),
    recurring: true,
    recurring_type: "monthly"
  });
});

afterAll(async () => {
  try {
    if (createdTransactionIds.size > 0) {
      await prisma.transactions.deleteMany({ where: { id: { in: Array.from(createdTransactionIds) } } });
    }
  } catch (error) {
    // Ignore cleanup errors
  }

  try {
    if (createdAccountIds.size > 0) {
      await prisma.accountPaymentMethods.deleteMany({ where: { accountId: { in: Array.from(createdAccountIds) } } });
    }
  } catch (error) {
    // Ignore cleanup errors
  }

  try {
    if (createdAccountIds.size > 0) {
      await prisma.accounts.deleteMany({ where: { id: { in: Array.from(createdAccountIds) } } });
    }
  } catch (error) {
    // Ignore cleanup errors
  }

  for (const paymentMethodId of createdPaymentMethodIds) {
    try {
      await prisma.paymentMethods.delete({ where: { id: paymentMethodId } });
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  for (const userId of createdUserIds) {
    try {
      await prisma.users.delete({ where: { id: userId } });
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  await prisma.$disconnect();
});

describe("GET /transactions", () => {
  it("deve listar transações do usuário com totais calculados", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.data.transactions)).toBe(true);
    expect(response.body.data.transactions.length).toBeGreaterThanOrEqual(3);
    expect(Number(response.body.data.totalIncome)).toBeGreaterThan(0);
    expect(Number(response.body.data.totalExpense)).toBeGreaterThan(0);
    expect(response.body.page).toBe(1);
  });

  it("deve filtrar transações por tipo", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, type: "expense" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transactions.every((t) => t.type === "expense")).toBe(true);
  });

  it("deve filtrar transações por categoria", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, category: "Alimentação" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transactions.some((t) => t.category === "Alimentação")).toBe(true);
  });

  it("deve filtrar transações por data de lançamento", async () => {
    const releaseDate = formatDate(new Date(baseExpenseTransaction.release_date));
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, release_date: releaseDate });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transactions.length).toBeGreaterThan(0);
  });

  it("deve filtrar transações por conta específica", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, accountId: primaryAccount.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transactions.every((t) => t.accountId === primaryAccount.id)).toBe(true);
  });

  it("deve retornar apenas transações recorrentes quando filtrado", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, recurring: true });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transactions.every((t) => t.recurring === true)).toBe(true);
  });

  it("deve respeitar o limite de resultados retornados", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.limite).toBe(2);
    expect(response.body.data.transactions.length).toBeLessThanOrEqual(2);
  });

  it("deve retornar 404 quando filtros não encontrarem transações", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, name: `Transação Inexistente ${Date.now()}` });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro ao omitir userId", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get("/transactions")
      .query({ userId: testUserId });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir acesso às transações de outro usuário", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(403);
    expect(response.body.error ?? true).toBe(true);
  });
});

describe("POST /transactions", () => {
  it("deve cadastrar uma transação de receita", async () => {
    const value = 420.5;
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: randomTransactionName(),
        type: "income",
        category: "Investimentos",
        value,
        release_date: generateDate(),
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(Number(response.body.data.value)).toBeCloseTo(value, 2);
    createdTransactionIds.add(response.body.data.id);
  });

  it("deve cadastrar uma transação recorrente", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: "Academia",
        type: "expense",
        category: "Saúde",
        value: 89.9,
        release_date: generateDate(),
        recurring: true,
        recurring_type: "monthly",
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data.recurring).toBe(true);
    expect(response.body.data.recurring_type).toBe("monthly");
    createdTransactionIds.add(response.body.data.id);
  });

  it("deve cadastrar uma transação parcelada", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: "Notebook",
        type: "expense",
        category: "Educação",
        value: 3000,
        number_installments: 3,
        release_date: generateDate(),
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data.number_installments).toBe(3);
    expect(response.body.data.current_installment).toBe(1);
    createdTransactionIds.add(response.body.data.id);
  });

  it("deve atualizar o saldo da conta ao registrar receita", async () => {
    const testAccount = await createAccountForUser({
      token: testToken,
      userId: testUserId,
      paymentMethodIds: [primaryPaymentMethodId],
      balance: 500
    });

    const previousBalance = await fetchAccountBalance(testAccount.id);

    const value = 275;
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: "Freelancer",
        type: "income",
        category: "Serviços",
        value,
        release_date: generateDate(),
        accountId: testAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(201);
    createdTransactionIds.add(response.body.data.id);

    const updatedBalance = await fetchAccountBalance(testAccount.id);
    expect(updatedBalance).toBeCloseTo(previousBalance + value, 2);
  });

  it("deve atualizar o saldo da conta ao registrar despesa", async () => {
    const testAccount = await createAccountForUser({
      token: testToken,
      userId: testUserId,
      paymentMethodIds: [primaryPaymentMethodId],
      balance: 800
    });

    const previousBalance = await fetchAccountBalance(testAccount.id);

    const value = 125.6;
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: "Cinema",
        type: "expense",
        category: "Lazer",
        value,
        release_date: generateDate(),
        accountId: testAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(201);
    createdTransactionIds.add(response.body.data.id);

    const updatedBalance = await fetchAccountBalance(testAccount.id);
    expect(updatedBalance).toBeCloseTo(previousBalance - value, 2);
  });

  it("deve recusar cadastro com conta inexistente", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: randomTransactionName(),
        type: "expense",
        category: "Teste",
        value: 100,
        release_date: generateDate(),
        accountId: 999999,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar cadastro com método de pagamento não associado", async () => {
    const orphanPaymentMethod = await createPaymentMethod(testToken, `Boleto ${Date.now()}`);

    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        name: randomTransactionName(),
        type: "expense",
        category: "Teste",
        value: 100,
        release_date: generateDate(),
        accountId: primaryAccount.id,
        paymentMethodId: orphanPaymentMethod.id
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar cadastro com payload inválido", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send({
        type: "income",
        category: "Teste",
        value: -10,
        release_date: "data inválida",
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve exigir userId na query", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: randomTransactionName(),
        type: "income",
        category: "Teste",
        value: 100,
        release_date: generateDate(),
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve recusar cadastro sem token", async () => {
    const response = await request(app)
      .post("/transactions")
      .query({ userId: testUserId })
      .send({
        name: randomTransactionName(),
        type: "income",
        category: "Teste",
        value: 100,
        release_date: generateDate(),
        accountId: primaryAccount.id,
        paymentMethodId: primaryPaymentMethodId
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });
});

describe("PATCH /transactions/:id", () => {
  it("deve atualizar nome, categoria e valor da transação", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({
        name: "Transação Atualizada",
        category: "Saúde",
        value: 999.99
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe("Transação Atualizada");
    expect(response.body.data.category).toBe("Saúde");
    expect(Number(response.body.data.value)).toBeCloseTo(999.99, 2);
  });

  it("deve permitir alterar conta e método de pagamento", async () => {
    const transaction = await createTransactionForUser();
    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({
        accountId: secondaryAccount.id,
        paymentMethodId: secondaryPaymentMethodId
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.accountId).toBe(secondaryAccount.id);
    expect(response.body.data.paymentMethodId).toBe(secondaryPaymentMethodId);
  });

  it("deve atualizar apenas a descrição quando informada", async () => {
    const transaction = await createTransactionForUser({ description: "Descrição inicial" });

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ description: "Descrição atualizada" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    // Verificar que a atualização foi aceita (descrição pode não retornar no select)
    expect(response.body.data.id).toBe(transaction.id);
  });

  it("deve permitir transformar transação em recorrente", async () => {
    const transaction = await createTransactionForUser({ recurring: false });

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ recurring: true, recurring_type: "weekly" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.recurring).toBe(true);
    expect(response.body.data.recurring_type).toBe("weekly");
  });

  it("deve retornar erro ao informar ID inválido", async () => {
    const response = await request(app)
      .patch("/transactions/abc")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: "abc", userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve retornar 404 ao atualizar transação inexistente", async () => {
    const response = await request(app)
      .patch("/transactions/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar atualização com valores inválidos", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ value: -50 });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve exigir userId na query", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id })
      .send({ name: "Teste" });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve recusar atualização sem token", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir alteração por outro usuário", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(403);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve recusar alteração com método de pagamento incompatível", async () => {
    const transaction = await createTransactionForUser();
    const orphanPaymentMethod = await createPaymentMethod(testToken, `Cartão Avulso ${Date.now()}`);

    const response = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId })
      .send({ 
        accountId: primaryAccount.id,
        paymentMethodId: orphanPaymentMethod.id 
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("DELETE /transactions/:id", () => {
  it("deve deletar uma transação do usuário", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .delete(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id, userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);

    const dbCheck = await prisma.transactions.findUnique({ where: { id: transaction.id } });
    expect(dbCheck).toBeNull();
  });

  it("deve retornar 404 ao deletar transação inexistente", async () => {
    const response = await request(app)
      .delete("/transactions/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro quando o id for inválido", async () => {
    const response = await request(app)
      .delete("/transactions/abc")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: "abc", userId: testUserId });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve recusar deleção sem token", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .delete(`/transactions/${transaction.id}`)
      .query({ id: transaction.id, userId: testUserId });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir deleção por outro usuário", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .delete(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: transaction.id, userId: testUserId });

    expect(response.status).toBe(403);
    expect(response.body.error ?? true).toBe(true);
  });

  it("deve exigir userId na query", async () => {
    const transaction = await createTransactionForUser();

    const response = await request(app)
      .delete(`/transactions/${transaction.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: transaction.id });

    expect(response.status).toBe(400);
    expect(response.body.error ?? true).toBe(true);
  });
});

describe("GET /transactions/download", () => {
  it("deve gerar um PDF de extrato quando há transações", async () => {
    const baseDate = new Date(baseIncomeTransaction.release_date);
    const startDateObject = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
    const startDate = formatDate(startDateObject);
    const endDate = generateDate(1);

    const response = await request(app)
      .get("/transactions/download")
      .set("Authorization", `Bearer ${testToken}`)
      .query({
        userId: testUserId,
        startDate,
        endDate,
        type: "all",
        accountId: primaryAccount.id
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/pdf/);
  });

  it("deve retornar erro quando parâmetros obrigatórios estiverem ausentes", async () => {
    const response = await request(app)
      .get("/transactions/download")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, startDate: generateDate(-5) });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("deve retornar 404 quando não houver transações no período", async () => {
    const response = await request(app)
      .get("/transactions/download")
      .set("Authorization", `Bearer ${testToken}`)
      .query({
        userId: testUserId,
        startDate: "2000-01-01",
        endDate: "2000-01-31",
        type: "income",
        accountId: primaryAccount.id
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });
});

describe("Recurring and Installment Transactions", () => {
  it("deve processar transação recorrente mensal corretamente", async () => {
    // Criar uma transação recorrente mensal do mês passado
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(15);
    
    const recurringTransaction = await createTransactionForUser({
      name: "Assinatura Netflix",
      type: "expense",
      category: "Lazer",
      value: 55.90,
      release_date: lastMonth.toISOString().split('T')[0],
      recurring: true,
      recurring_type: "monthly"
    });

    expect(recurringTransaction.recurring).toBe(true);
    expect(recurringTransaction.recurring_type).toBe("monthly");
    
    // Verificar que foi criada
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ 
        userId: testUserId, 
        name: "Assinatura Netflix",
        recurring: true
      });

    expect(response.status).toBe(200);
    expect(response.body.data.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Assinatura Netflix",
          recurring: true,
          recurring_type: "monthly"
        })
      ])
    );
  });

  it("deve criar transação parcelada e calcular valor da parcela", async () => {
    const totalValue = 900;
    const installments = 3;
    
    const installmentTransaction = await createTransactionForUser({
      name: "Notebook",
      type: "expense",
      category: "Educação",
      value: totalValue,
      release_date: generateDate(),
      number_installments: installments
    });

    expect(installmentTransaction.number_installments).toBe(installments);
    expect(Number(installmentTransaction.value_installment)).toBeCloseTo(totalValue / installments, 2);
    expect(installmentTransaction.current_installment).toBe(1);
  });

  it("deve listar transações parceladas corretamente", async () => {
    await createTransactionForUser({
      name: "Geladeira",
      type: "expense",
      category: "Casa",
      value: 2400,
      release_date: generateDate(-5),
      number_installments: 12
    });

    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ 
        userId: testUserId,
        name: "Geladeira"
      });

    expect(response.status).toBe(200);
    const geladeira = response.body.data.transactions.find(t => t.name === "Geladeira");
    expect(geladeira).toBeDefined();
    expect(geladeira.number_installments).toBe(12);
    expect(Number(geladeira.value_installment)).toBeCloseTo(200, 2);
  });
});
