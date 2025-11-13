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

const createdGoalIds = new Set();
const createdUserIds = new Set();

const adminCredentials = {
  email: "thalysson140105@gmail.com",
  password: "Senha@12345"
};

const randomEmail = () => `goal${faker.number.int({ min: 1000, max: 9999 })}@test.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const buildUserPayload = () => ({
  name: `Goal User ${faker.number.int({ min: 1000, max: 9999 })}`,
  email: randomEmail(),
  password: randomPassword()
});

const randomGoalName = () => `Meta ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomValue = () => Number(faker.number.float({ min: 500, max: 5000, precision: 0.01 }).toFixed(2));
const formatDate = (date) => date.toISOString().split("T")[0];

const generateMonthDate = (offsetMonths = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() + offsetMonths);
  date.setDate(1);
  return formatDate(date);
};

const loginUser = async (email, password) => (
  request(app).post("/login").send({ email, password })
);

const createGoalForUser = async (overrides = {}) => {
  const payload = {
    name: overrides.name ?? randomGoalName(),
    date: overrides.date ?? generateMonthDate(),
    transaction_type: overrides.transaction_type ?? "expense",
    value: overrides.value ?? randomValue()
  };

  const response = await request(app)
    .post("/goals")
    .set("Authorization", `Bearer ${overrides.token ?? testToken}`)
    .query({ userId: overrides.userId ?? testUserId })
    .send(payload);

  if (response.status !== 201) {
    throw new Error(`Failed to create goal: ${JSON.stringify(response.body)}`);
  }

  const goal = response.body.data;
  createdGoalIds.add(goal.id);
  return goal;
};

let baseIncomeGoal;
let baseExpenseGoal;

beforeAll(async () => {
  // Login admin user
  const loginResponse = await loginUser(adminCredentials.email, adminCredentials.password);
  expect(loginResponse.status).toBe(200);
  testToken = loginResponse.body.data.accessToken;
  testUserId = loginResponse.body.data.usuario?.id ?? loginResponse.body.data.user?.id;

  if (!testUserId) {
    throw new Error("Failed to retrieve admin user ID from login response");
  }

  // Clean up any existing goals for the test user to avoid conflicts
  try {
    await prisma.goals.deleteMany({
      where: { userId: testUserId }
    });
  } catch (error) {
    console.error("Error cleaning up existing goals:", error);
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

  // Create base goals
  baseIncomeGoal = await createGoalForUser({
    name: "Meta de Receita Mensal",
    transaction_type: "income",
    value: 5000,
    date: generateMonthDate(-10) // Usar mês passado único
  });

  console.log("Created baseIncomeGoal:", baseIncomeGoal);

  baseExpenseGoal = await createGoalForUser({
    name: "Meta de Despesa Mensal",
    transaction_type: "expense",
    value: 3000,
    date: generateMonthDate(-11) // Usar mês passado único
  });

  console.log("Created baseExpenseGoal:", baseExpenseGoal);
});

afterAll(async () => {
  try {
    if (createdGoalIds.size > 0) {
      await prisma.goals.deleteMany({
        where: { id: { in: Array.from(createdGoalIds) } }
      });
    }
  } catch (error) {
    console.error("Error deleting goals:", error);
  }
  await prisma.$disconnect();
});

describe("GET /goals", () => {
  it("deve listar metas do usuário com totais calculados", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Verificar se as metas têm os totais de transações
    const incomeGoal = response.body.data.find(g => g.id === baseIncomeGoal.id);
    expect(incomeGoal).toBeDefined();
    expect(incomeGoal.incomeTotal).toBeDefined();

    const expenseGoal = response.body.data.find(g => g.id === baseExpenseGoal.id);
    expect(expenseGoal).toBeDefined();
    expect(expenseGoal.expenseTotal).toBeDefined();
  });

  it("deve filtrar metas por tipo de transação (income)", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, transaction_type: "income" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.every(g => g.transaction_type === "income")).toBe(true);
  });

  it("deve filtrar metas por tipo de transação (expense)", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, transaction_type: "expense" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.every(g => g.transaction_type === "expense")).toBe(true);
  });

  it("deve filtrar metas por data (mês/ano)", async () => {
    const testMonth = generateMonthDate(-10); // Mês do baseIncomeGoal
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, date: testMonth });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("deve filtrar metas por nome", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, name: baseIncomeGoal.name });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].name).toBe(baseIncomeGoal.name);
  });

  it("deve filtrar metas por ID específico", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, id: baseExpenseGoal.id });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(baseExpenseGoal.id);
  });

  it("deve respeitar paginação com limit", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, page: 1, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it("deve respeitar paginação com page e limit", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, page: 1, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it("deve retornar metadados com total e anos", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("deve retornar erro ao omitir userId", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(400);
  });

  it("deve retornar erro ao acessar sem token", async () => {
    const response = await request(app)
      .get("/goals")
      .query({ userId: testUserId });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir acesso às metas de outro usuário", async () => {
    const response = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ userId: testUserId });

    expect(response.status).toBe(403);
  });
});

describe("POST /goals", () => {
  it("deve cadastrar uma meta de receita", async () => {
    const goalData = {
      name: "Nova Meta de Receita",
      date: generateMonthDate(21), // Mês futuro sem conflitos
      transaction_type: "income",
      value: 6000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(goalData.name);
    expect(response.body.data.transaction_type).toBe(goalData.transaction_type);
    expect(Number(response.body.data.value)).toBe(goalData.value);
    expect(response.body.data.incomeTotal).toBeDefined();

    createdGoalIds.add(response.body.data.id);
  });

  it("deve cadastrar uma meta de despesa", async () => {
    const goalData = {
      name: "Nova Meta de Despesa",
      date: generateMonthDate(2), // Daqui a 2 meses
      transaction_type: "expense",
      value: 2500
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(goalData.name);
    expect(response.body.data.transaction_type).toBe(goalData.transaction_type);
    expect(Number(response.body.data.value)).toBe(goalData.value);
    expect(response.body.data.expenseTotal).toBeDefined();

    createdGoalIds.add(response.body.data.id);
  });

  it("deve recusar cadastro com nome vazio", async () => {
    const goalData = {
      name: "",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro com nome apenas numérico", async () => {
    const goalData = {
      name: "12345",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro com data inválida", async () => {
    const goalData = {
      name: "Meta com Data Inválida",
      date: "invalid-date",
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro com tipo de transação inválido", async () => {
    const goalData = {
      name: "Meta com Tipo Inválido",
      date: generateMonthDate(3),
      transaction_type: "invalid_type",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro com valor zero", async () => {
    const goalData = {
      name: "Meta com Valor Zero",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 0
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro com valor negativo", async () => {
    const goalData = {
      name: "Meta com Valor Negativo",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: -1000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve exigir userId na query", async () => {
    const goalData = {
      name: "Meta sem UserId",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .send(goalData);

    expect(response.status).toBe(400);
  });

  it("deve recusar cadastro sem token", async () => {
    const goalData = {
      name: "Meta sem Token",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
  });

  it("deve impedir cadastro para outro usuário", async () => {
    const goalData = {
      name: "Meta de Outro Usuário",
      date: generateMonthDate(3),
      transaction_type: "income",
      value: 5000
    };

    const response = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ userId: testUserId })
      .send(goalData);

    expect(response.status).toBe(403);
  });
});

describe("PATCH /goals/:id", () => {
  it("deve atualizar nome da meta", async () => {
    const goal = await createGoalForUser({
      name: "Nome Original",
      date: generateMonthDate(4),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ name: "Nome Atualizado" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe("Nome Atualizado");
  });

  it("deve atualizar valor da meta", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(5),
      transaction_type: "expense",
      value: 2000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ value: 2500 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Number(response.body.data.value)).toBe(2500);
  });

  it("deve atualizar data da meta para outro mês", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(6),
      transaction_type: "income",
      value: 4000
    });

    const newDate = generateMonthDate(7);
    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ date: newDate });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(formatDate(new Date(response.body.data.date))).toBe(newDate);
  });

  it("deve atualizar tipo de transação da meta", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(50),
      transaction_type: "income",
      value: 3500
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ transaction_type: "expense" });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.transaction_type).toBe("expense");
    expect(response.body.data.expenseTotal).toBeDefined();
  });

  it("deve atualizar múltiplos campos simultaneamente", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(9),
      transaction_type: "expense",
      value: 1500
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({
        name: "Meta Atualizada Completa",
        value: 2000
      });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.name).toBe("Meta Atualizada Completa");
    expect(Number(response.body.data.value)).toBe(2000);
  });

  it("deve retornar 404 ao atualizar meta inexistente", async () => {
    const response = await request(app)
      .patch("/goals/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve recusar atualização com nome apenas numérico", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(24),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ name: "98765" });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização com valor zero", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(12),
      transaction_type: "expense",
      value: 2000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ value: 0 });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização com valor negativo", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(13),
      transaction_type: "income",
      value: 4000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ value: -500 });

    expect(response.status).toBe(400);
  });

  it("deve exigir userId na query", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(61),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id })
      .send({ name: "Teste" });

    expect(response.status).toBe(400);
  });

  it("deve recusar atualização sem token", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(15),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ name: "Teste" });

    expect(response.status).toBe(401);
  });

  it("deve impedir alteração por outro usuário", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(26),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .patch(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: goal.id, userId: testUserId })
      .send({ name: "Tentativa de Alteração" });

    expect(response.status).toBe(403);
  });
});

describe("DELETE /goals/:id", () => {
  it("deve deletar uma meta do usuário", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(17),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .delete(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id, userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.message).toContain("deletada com sucesso");

    // Verificar que foi realmente deletada
    const checkResponse = await request(app)
      .get("/goals")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ userId: testUserId, id: goal.id });

    expect(checkResponse.body.data.length).toBe(0);
    createdGoalIds.delete(goal.id);
  });

  it("deve retornar 404 ao deletar meta inexistente", async () => {
    const response = await request(app)
      .delete("/goals/999999")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: 999999, userId: testUserId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("deve retornar erro quando o id for inválido", async () => {
    const response = await request(app)
      .delete("/goals/invalid-id")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: "invalid-id", userId: testUserId });

    expect(response.status).toBe(400);
  });

  it("deve recusar deleção sem token", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(18),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .delete(`/goals/${goal.id}`)
      .query({ id: goal.id, userId: testUserId });

    expect(response.status).toBe(401);
  });

  it("deve impedir deleção por outro usuário", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(53),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .delete(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${secondaryToken}`)
      .query({ id: goal.id, userId: testUserId });

    expect(response.status).toBe(403);
  });

  it("deve exigir userId na query", async () => {
    const goal = await createGoalForUser({
      date: generateMonthDate(20),
      transaction_type: "income",
      value: 3000
    });

    const response = await request(app)
      .delete(`/goals/${goal.id}`)
      .set("Authorization", `Bearer ${testToken}`)
      .query({ id: goal.id });

    expect(response.status).toBe(400);
  });
});
