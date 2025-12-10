import request from "supertest";
import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	jest
} from "@jest/globals";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import app from "../../app.js";
import { faker } from "@faker-js/faker";
import { prisma } from "../../config/prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");

jest.setTimeout(40000);

let testUserId;
let testToken;
let secondaryUserId;
let secondaryToken;
let paymentMethodId = null;

const generatedFiles = new Set();

const randomEmail = () => `account.${faker.string.alphanumeric({ length: 10, casing: "lower" })}.${Date.now()}@example.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const buildUserPayload = () => ({
	name: `Account Test User ${faker.number.int({ min: 1000, max: 9999 })}`,
	email: randomEmail(),
	password: randomPassword()
});

const accountTypes = [
	"conta_corrente",
	"poupanca",
	"carteira_digital",
	"investimento",
	"conta_salario"
];

const randomAccountName = () => `Conta Teste ${faker.number.int({ min: 1000, max: 9999 })}`;
const randomAccountType = () => faker.helpers.arrayElement(accountTypes);
const randomBalance = () => Number(faker.number.float({ min: 50, max: 5000, precision: 0.01 }).toFixed(2));

const resolveFilePath = (filePath) => (
	path.isAbsolute(filePath) ? filePath : path.join(ROOT_DIR, filePath)
);

const trackIconFile = (iconPath) => {
	if (!iconPath) {
		return;
	}
	const relativePath = iconPath.startsWith("src") ? iconPath : path.join("src", iconPath);
	generatedFiles.add(resolveFilePath(relativePath));
};

const loginUser = async (email, password) => (
	request(app).post("/login").send({ email, password })
);

const cleanupAccountsForUser = async (userId) => {
	if (!userId) {
		return;
	}
	try {
		const accountIds = await prisma.accounts.findMany({
			where: { userId },
			select: { id: true }
		}).then((items) => items.map((item) => item.id));

		if (accountIds.length === 0) {
			return;
		}

		await prisma.accountPaymentMethods.deleteMany({
			where: { accountId: { in: accountIds } }
		});

		await prisma.accounts.deleteMany({
			where: { id: { in: accountIds } }
		});
	} catch (error) {
		// Best-effort cleanup; swallow errors to avoid masking test results
	}
};

beforeAll(async () => {
	const testUserPayload = buildUserPayload();

	const createUserResponse = await request(app)
		.post("/users")
		.field("name", testUserPayload.name)
		.field("email", testUserPayload.email)
		.field("password", testUserPayload.password);

	expect(createUserResponse.status).toBe(201);
	expect(createUserResponse.body.error).toBe(false);
	testUserId = createUserResponse.body.data.id;

	const loginResponse = await loginUser(testUserPayload.email, testUserPayload.password);
	expect(loginResponse.status).toBe(200);
	testToken = loginResponse.body.data.accessToken;

	const secondaryUserPayload = buildUserPayload();
	const createSecondaryResponse = await request(app)
		.post("/users")
		.field("name", secondaryUserPayload.name)
		.field("email", secondaryUserPayload.email)
		.field("password", secondaryUserPayload.password);

	expect(createSecondaryResponse.status).toBe(201);
	secondaryUserId = createSecondaryResponse.body.data.id;

	const secondaryLoginResponse = await loginUser(secondaryUserPayload.email, secondaryUserPayload.password);
	expect(secondaryLoginResponse.status).toBe(200);
	secondaryToken = secondaryLoginResponse.body.data.accessToken;

	const paymentMethod = await prisma.paymentMethods.findFirst({ select: { id: true } });
	paymentMethodId = paymentMethod?.id ?? null;

	const baseResponse = await request(app)
		.post("/account")
		.set("Authorization", `Bearer ${testToken}`)
		.query({ userId: testUserId })
		.field("name", randomAccountName())
		.field("type", randomAccountType())
		.field("balance", randomBalance().toFixed(2));

	expect(baseResponse.status).toBe(201);
	expect(baseResponse.body.error).toBe(false);
		const baseAccountData = baseResponse.body.data;
		trackIconFile(baseAccountData.icon);
});

afterAll(async () => {
	for (const filePath of generatedFiles) {
		try {
			await fs.unlink(filePath);
		} catch (error) {
		}
	}

	await cleanupAccountsForUser(testUserId);
	await cleanupAccountsForUser(secondaryUserId);

	if (testUserId) {
		try {
			await prisma.users.delete({ where: { id: testUserId } });
		} catch (error) {
		}
	}

	if (secondaryUserId) {
		try {
			await prisma.users.delete({ where: { id: secondaryUserId } });
		} catch (error) {
		}
	}

	await prisma.$disconnect();
});

describe("GET /account/:id", () => {
	it("deve listar contas do usuário com saldo total", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId });

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(Array.isArray(response.body.data.contas)).toBe(true);
		expect(response.body.data.contas.length).toBeGreaterThan(0);
		expect(response.body.page).toBe(1);
		expect(response.body.data).toHaveProperty("totalBalance");
	});

	it("deve aplicar filtro por nome da conta", async () => {
		const filteredName = randomAccountName();

		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", filteredName)
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(createResponse.status).toBe(201);

		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId, name: filteredName });

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		const hasFilteredAccount = response.body.data.contas.some((account) => account.name === filteredName);
		expect(hasFilteredAccount).toBe(true);
	});

	it("deve aplicar filtro por tipo de conta", async () => {
		const filteredType = "poupanca";

		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", filteredType)
			.field("balance", randomBalance().toFixed(2));

		expect(createResponse.status).toBe(201);

		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId, type: filteredType });

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		const onlyFilteredType = response.body.data.contas.every((account) => account.type === filteredType);
		expect(onlyFilteredType).toBe(true);
	});

	it("deve limitar a quantidade de resultados retornados", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId, limit: 1 });

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.limite).toBe(1);
		expect(response.body.data.contas.length).toBeLessThanOrEqual(1);
	});

	it("deve retornar 404 quando nenhum resultado for encontrado", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId, name: `Conta Inexistente ${Date.now()}` });

		expect(response.status).toBe(404);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro ao omitir o userId", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${testToken}`);

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve retornar erro ao acessar sem token", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.query({ userId: testUserId });

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve impedir acesso às contas de outro usuário", async () => {
		const response = await request(app)
			.get(`/account/${testUserId}`)
			.set("Authorization", `Bearer ${secondaryToken}`)
			.query({ userId: testUserId });

		expect(response.status).toBe(403);
		expect(response.body.error ?? true).toBe(true);
	});
});

describe("POST /account", () => {
	it("deve cadastrar uma nova conta básica", async () => {
		const name = randomAccountName();
		const type = randomAccountType();
		const balance = randomBalance();

		const response = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", name)
			.field("type", type)
			.field("balance", balance.toFixed(2));

		expect(response.status).toBe(201);
		expect(response.body.error).toBe(false);
		expect(response.body.data).toMatchObject({
			name,
			type,
			userId: testUserId
		});
		expect(Number(response.body.data.balance)).toBeCloseTo(balance, 2);
	});

	it("deve aceitar upload de ícone", async () => {
		const iconBuffer = Buffer.from("fake image content");

		const response = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2))
			.attach("icon", iconBuffer, "icon.png");

		expect(response.status).toBe(201);
		expect(response.body.error).toBe(false);
		expect(response.body.data.icon).toBeTruthy();
		trackIconFile(response.body.data.icon);
	});

	it("não deve permitir conta duplicada por nome e tipo para o mesmo usuário", async () => {
		const name = randomAccountName();
		const type = "conta_corrente";

		const firstResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", name)
			.field("type", type)
			.field("balance", randomBalance().toFixed(2));

		expect(firstResponse.status).toBe(201);

		const duplicateResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", name)
			.field("type", type)
			.field("balance", randomBalance().toFixed(2));

		expect(duplicateResponse.status).toBe(409);
		expect(duplicateResponse.body.error).toBe(true);
	});

	it("deve falhar quando método de pagamento não existir", async () => {
		const response = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2))
			.field("paymentMethodIds", "999999");

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro ao enviar payload incompleto", async () => {
		const response = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve exigir o parâmetro userId", async () => {
		const response = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve recusar criação sem token", async () => {
		const response = await request(app)
			.post("/account")
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});
});

describe("PATCH /account/:id", () => {
	it("deve atualizar nome, tipo e saldo da conta", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", "conta_corrente")
			.field("balance", randomBalance().toFixed(2));

		expect(createResponse.status).toBe(201);
		const account = createResponse.body.data;

		const newName = `Conta Atualizada ${faker.number.int({ min: 1000, max: 9999 })}`;
		const newType = "poupanca";
		const newBalance = randomBalance();

		const response = await request(app)
			.patch(`/account/${account.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: account.id, userId: testUserId })
			.field("name", newName)
			.field("type", newType)
			.field("balance", newBalance.toFixed(2));

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.data.name).toBe(newName);
		expect(response.body.data.type).toBe(newType);
		expect(Number(response.body.data.balance)).toBeCloseTo(newBalance, 2);
	});

	it("deve atualizar apenas o ícone da conta", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(createResponse.status).toBe(201);
		const account = createResponse.body.data;

		const iconBuffer = Buffer.from("updated icon content");

		const response = await request(app)
			.patch(`/account/${account.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: account.id, userId: testUserId })
			.attach("icon", iconBuffer, "icon.png");

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.data.icon).toBeTruthy();
		trackIconFile(response.body.data.icon);
	});

	it("não deve permitir atualização que gere duplicidade", async () => {
		const nameA = randomAccountName();
		const nameB = randomAccountName();
		const type = "conta_corrente";

		const firstResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", nameA)
			.field("type", type)
			.field("balance", randomBalance().toFixed(2));

		const secondResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", nameB)
			.field("type", type)
			.field("balance", randomBalance().toFixed(2));

		expect(firstResponse.status).toBe(201);
		expect(secondResponse.status).toBe(201);

		const accountB = secondResponse.body.data;

		const response = await request(app)
			.patch(`/account/${accountB.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: accountB.id, userId: testUserId })
			.field("name", nameA)
			.field("type", type);

		expect(response.status).toBe(409);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar 404 ao tentar atualizar conta inexistente", async () => {
		const response = await request(app)
			.patch("/account/999999")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: 999999, userId: testUserId })
			.field("name", "Conta Fantasma");

		expect(response.status).toBe(404);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar 400 quando o id for inválido", async () => {
		const response = await request(app)
			.patch("/account/abc")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: "abc", userId: testUserId })
			.field("name", "Conta");

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve recusar atualização sem token", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.patch(`/account/${account.id}`)
			.query({ id: account.id, userId: testUserId })
			.field("name", "Conta sem token");

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve impedir atualização por outro usuário", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.patch(`/account/${account.id}`)
			.set("Authorization", `Bearer ${secondaryToken}`)
			.query({ id: account.id, userId: testUserId })
			.field("name", "Conta Inválida");

		expect(response.status).toBe(403);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve exigir userId durante a atualização", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.patch(`/account/${account.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: account.id })
			.field("name", "Conta Sem User");

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});
});

describe("DELETE /account/:id", () => {
	it("deve deletar uma conta do usuário", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		expect(createResponse.status).toBe(201);
		const account = createResponse.body.data;

		const response = await request(app)
			.delete(`/account/${account.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: account.id, userId: testUserId });

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);

		const dbCheck = await prisma.accounts.findUnique({ where: { id: account.id } });
		expect(dbCheck).toBeNull();
	});

	it("deve retornar 404 ao deletar conta inexistente", async () => {
		const response = await request(app)
			.delete("/account/999999")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: 999999, userId: testUserId });

		expect(response.status).toBe(404);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar 400 quando o id for inválido", async () => {
		const response = await request(app)
			.delete("/account/abc")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: "abc", userId: testUserId });

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve recusar deleção sem token", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.delete(`/account/${account.id}`)
			.query({ id: account.id, userId: testUserId });

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve impedir deleção por outro usuário", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.delete(`/account/${account.id}`)
			.set("Authorization", `Bearer ${secondaryToken}`)
			.query({ id: account.id, userId: testUserId });

		expect(response.status).toBe(403);
		expect(response.body.error ?? true).toBe(true);
	});

	it("deve retornar erro ao omitir userId", async () => {
		const createResponse = await request(app)
			.post("/account")
			.set("Authorization", `Bearer ${testToken}`)
			.query({ userId: testUserId })
			.field("name", randomAccountName())
			.field("type", randomAccountType())
			.field("balance", randomBalance().toFixed(2));

		const account = createResponse.body.data;

		const response = await request(app)
			.delete(`/account/${account.id}`)
			.set("Authorization", `Bearer ${testToken}`)
			.query({ id: account.id });

		expect(response.status).toBe(400);
		expect(response.body.error ?? true).toBe(true);
	});
});

