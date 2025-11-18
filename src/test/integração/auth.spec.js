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
import bcrypt from "bcryptjs";

jest.setTimeout(40000);

let testUserId;
let testUserEmail;
let testUserPassword;
let testUserName;
let testRefreshToken;
let testAccessToken;

const randomEmail = () => `auth.${faker.string.alphanumeric({ length: 10, casing: "lower" })}.${Date.now()}@example.com`;
const randomPassword = () => `Aa1@${faker.string.alphanumeric({ length: 8, casing: "mixed" })}`;
const randomName = () => `Auth Test User ${faker.number.int({ min: 1000, max: 9999 })}`;

const buildUserPayload = () => ({
	name: randomName(),
	email: randomEmail(),
	password: randomPassword()
});

const createTestUser = async (userData) => {
	const hashedPassword = await bcrypt.hash(userData.password, parseInt(process.env.SALT || "10"));
	
	const user = await prisma.users.create({
		data: {
			name: userData.name,
			email: userData.email,
			password: hashedPassword
		}
	});
	
	return user;
};

beforeAll(async () => {
	testUserPassword = randomPassword();
	testUserEmail = randomEmail();
	testUserName = randomName();
	
	const user = await createTestUser({
		name: testUserName,
		email: testUserEmail,
		password: testUserPassword
	});
	
	testUserId = user.id;
});

afterAll(async () => {
	// Cleanup: Delete reset codes
	if (testUserEmail) {
		try {
			await prisma.resetCodes.deleteMany({
				where: { email: testUserEmail }
			});
		} catch (error) {
			// Best-effort cleanup
		}
	}
	
	// Cleanup: Delete test user
	if (testUserId) {
		try {
			await prisma.users.delete({
				where: { id: testUserId }
			});
		} catch (error) {
			// Best-effort cleanup
		}
	}
	
	await prisma.$disconnect();
});

describe("POST /login", () => {
	it("deve fazer login com credenciais válidas", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.data).toHaveProperty("accessToken");
		expect(response.body.data).toHaveProperty("refreshToken");
		expect(response.body.data).toHaveProperty("usuario");
		expect(response.body.data.usuario).toHaveProperty("id");
		expect(response.body.data.usuario).toHaveProperty("name");
		expect(response.body.data.usuario).toHaveProperty("email");
		expect(response.body.data.usuario).not.toHaveProperty("password");
		expect(response.body.data.usuario).not.toHaveProperty("senha");
		
		// Armazena tokens para testes posteriores
		testAccessToken = response.body.data.accessToken;
		testRefreshToken = response.body.data.refreshToken;
	});

	it("deve retornar erro 401 com email inválido", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: "emailinexistente@example.com",
				password: testUserPassword
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Email ou senha inválidos");
	});

	it("deve retornar erro 401 com senha inválida", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: "senhaErrada123!"
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Email ou senha inválidos");
	});

	it("deve retornar erro 400 ao omitir email", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				password: testUserPassword
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao omitir senha", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: testUserEmail
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 com email em formato inválido", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: "emailinvalido",
				password: testUserPassword
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao enviar corpo vazio", async () => {
		const response = await request(app)
			.post("/login")
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve atualizar refreshToken no banco após login", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});

		expect(response.status).toBe(200);

		const user = await prisma.users.findUnique({
			where: { id: testUserId }
		});

		expect(user.refreshToken).toBeTruthy();
		expect(user.refreshToken).toBe(response.body.data.refreshToken);
	});
});

describe("POST /refresh-token", () => {
	beforeAll(async () => {
		// Garantir que temos um refresh token válido
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});
		
		testRefreshToken = loginResponse.body.data.refreshToken;
		testAccessToken = loginResponse.body.data.accessToken;
	});

	it("deve gerar novo accessToken com refreshToken válido", async () => {
		// Esperar 1 segundo para garantir que o novo token será diferente devido ao timestamp
		await new Promise(resolve => setTimeout(resolve, 1000));

		const response = await request(app)
			.post("/refresh-token")
			.send({
				refreshToken: testRefreshToken
			});

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.data).toHaveProperty("accessToken");
		expect(response.body.data).toHaveProperty("refreshToken");
		expect(response.body.data.accessToken).not.toBe(testAccessToken);
		expect(response.body.data.refreshToken).toBe(testRefreshToken);
	});

	it("deve retornar erro 401 com refreshToken inválido", async () => {
		const response = await request(app)
			.post("/refresh-token")
			.send({
				refreshToken: "tokenInvalidoQueNaoExiste123"
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao omitir refreshToken", async () => {
		const response = await request(app)
			.post("/refresh-token")
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 401 com refreshToken expirado/revogado", async () => {
		// Primeiro faz logout para invalidar o token
		await request(app)
			.post("/logout")
			.set("Authorization", `Bearer ${testAccessToken}`)
			.send({
				id: testUserId.toString()
			});

		const response = await request(app)
			.post("/refresh-token")
			.send({
				refreshToken: testRefreshToken
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);

		// Re-login para próximos testes
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});
		
		testRefreshToken = loginResponse.body.data.refreshToken;
		testAccessToken = loginResponse.body.data.accessToken;
	});
});

describe("POST /logout", () => {
	beforeAll(async () => {
		// Garantir que temos tokens válidos
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});
		
		testRefreshToken = loginResponse.body.data.refreshToken;
		testAccessToken = loginResponse.body.data.accessToken;
	});

	it("deve fazer logout com sucesso", async () => {
		// Re-login para ter um token fresco
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});

		const freshToken = loginResponse.body.data.accessToken;

		const response = await request(app)
			.post("/logout")
			.set("Authorization", `Bearer ${freshToken}`)
			.send({
				id: testUserId.toString()
			});

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);
		expect(response.body.data.message).toContain("Logout realizado com sucesso");

		// Verificar se o refreshToken foi removido do banco
		const user = await prisma.users.findUnique({
			where: { id: testUserId }
		});

		expect(user.refreshToken).toBeNull();
	});

	it("deve retornar erro 401 sem token de autenticação", async () => {
		const response = await request(app)
			.post("/logout")
			.send({
				id: testUserId.toString()
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 401 com token inválido", async () => {
		const response = await request(app)
			.post("/logout")
			.set("Authorization", "Bearer tokenInvalido123")
			.send({
				id: testUserId.toString()
			});

		expect(response.status).toBe(401);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao omitir id do usuário", async () => {
		// Re-login para ter um token fresco
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});

		const freshToken = loginResponse.body.data.accessToken;

		const response = await request(app)
			.post("/logout")
			.set("Authorization", `Bearer ${freshToken}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});
});

describe("POST /forgot-password", () => {
	it("deve enviar código de recuperação para email válido", async () => {
		const response = await request(app)
			.post("/forgot-password")
			.send({
				email: testUserEmail
			});

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);

		// Verificar se o código foi criado no banco
		const resetCode = await prisma.resetCodes.findFirst({
			where: {
				email: testUserEmail,
				used: false
			},
			orderBy: {
				id: 'desc'
			}
		});

		expect(resetCode).toBeTruthy();
		expect(resetCode.code).toHaveLength(6);
		expect(resetCode.expiresAt.getTime()).toBeGreaterThan(Date.now());
	});

	it("deve retornar erro 404 com email não cadastrado", async () => {
		const response = await request(app)
			.post("/forgot-password")
			.send({
				email: "emailnaocadastrado@example.com"
			});

		expect(response.status).toBe(404);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Email não encontrado");
	});

	it("deve retornar erro 400 ao omitir email", async () => {
		const response = await request(app)
			.post("/forgot-password")
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 com email em formato inválido", async () => {
		const response = await request(app)
			.post("/forgot-password")
			.send({
				email: "emailinvalido"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve permitir múltiplas solicitações de recuperação", async () => {
		// Primeira solicitação
		const firstResponse = await request(app)
			.post("/forgot-password")
			.send({
				email: testUserEmail
			});

		expect(firstResponse.status).toBe(200);

		// Segunda solicitação
		const secondResponse = await request(app)
			.post("/forgot-password")
			.send({
				email: testUserEmail
			});

		expect(secondResponse.status).toBe(200);

		// Verificar se múltiplos códigos foram criados
		const resetCodes = await prisma.resetCodes.findMany({
			where: {
				email: testUserEmail,
				used: false
			}
		});

		expect(resetCodes.length).toBeGreaterThanOrEqual(2);
	});
});

describe("POST /reset-password", () => {
	let validResetCode;

	beforeEach(async () => {
		// Criar um código de reset válido para cada teste
		const response = await request(app)
			.post("/forgot-password")
			.send({
				email: testUserEmail
			});

		expect(response.status).toBe(200);

		// Buscar o código recém-criado
		const resetCodeRecord = await prisma.resetCodes.findFirst({
			where: {
				email: testUserEmail,
				used: false
			},
			orderBy: {
				id: 'desc'
			}
		});

		validResetCode = resetCodeRecord.code;
	});

	it("deve redefinir senha com código válido", async () => {
		const newPassword = "NovaSenha123!";

		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: validResetCode,
				password: newPassword
			});

		expect(response.status).toBe(200);
		expect(response.body.error).toBe(false);

		// Verificar se o código foi marcado como usado
		const resetCodeRecord = await prisma.resetCodes.findFirst({
			where: {
				email: testUserEmail,
				code: validResetCode
			}
		});

		expect(resetCodeRecord.used).toBe(true);

		// Tentar fazer login com a nova senha
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: newPassword
			});

		expect(loginResponse.status).toBe(200);

		// Restaurar senha original para próximos testes
		testUserPassword = newPassword;
	});

	it("deve retornar erro 400 com código inválido", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: "999999",
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Código inválido ou expirado");
	});

	it("deve retornar erro 400 ao tentar reutilizar código já usado", async () => {
		const newPassword = "NovaSenha123!";

		// Primeira tentativa (deve funcionar)
		const firstResponse = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: validResetCode,
				password: newPassword
			});

		expect(firstResponse.status).toBe(200);

		// Segunda tentativa com mesmo código (deve falhar)
		const secondResponse = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: validResetCode,
				password: "OutraSenha456!"
			});

		expect(secondResponse.status).toBe(400);
		expect(secondResponse.body.error).toBe(true);
		expect(secondResponse.body.message).toContain("Código inválido ou expirado");
	});

	it("deve retornar erro 400 ao omitir email", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				code: validResetCode,
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao omitir código", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 ao omitir senha", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: validResetCode
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 com senha muito curta", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: validResetCode,
				password: "123"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 com código de tamanho inválido", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: "12345", // Menos de 6 dígitos
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
	});

	it("deve retornar erro 400 quando código não pertence ao email informado", async () => {
		const response = await request(app)
			.post("/reset-password")
			.send({
				email: "emailinexistente@example.com",
				code: validResetCode,
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Código inválido ou expirado");
	});

	it("deve retornar erro 400 com código expirado", async () => {
		// Criar um código expirado manualmente
		const expiredCode = "123456";
		const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hora atrás

		await prisma.resetCodes.create({
			data: {
				email: testUserEmail,
				code: expiredCode,
				expiresAt: pastDate,
				used: false
			}
		});

		const response = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code: expiredCode,
				password: "NovaSenha123!"
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(true);
		expect(response.body.message).toContain("Código inválido ou expirado");
	});
});

describe("Fluxo completo de autenticação", () => {
	it("deve executar fluxo completo: login -> refresh -> logout", async () => {
		// 1. Login
		const loginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: testUserPassword
			});

		expect(loginResponse.status).toBe(200);
		const { accessToken, refreshToken } = loginResponse.body.data;

		// 2. Refresh Token
		// Esperar 1 segundo para garantir que o novo token será diferente
		await new Promise(resolve => setTimeout(resolve, 1000));

		const refreshResponse = await request(app)
			.post("/refresh-token")
			.send({ refreshToken });

		expect(refreshResponse.status).toBe(200);
		const newAccessToken = refreshResponse.body.data.accessToken;
		expect(newAccessToken).not.toBe(accessToken);

		// 3. Logout
		const logoutResponse = await request(app)
			.post("/logout")
			.set("Authorization", `Bearer ${newAccessToken}`)
			.send({ id: testUserId.toString() });

		expect(logoutResponse.status).toBe(200);

		// 4. Verificar que refresh token não funciona mais após logout
		const refreshAfterLogout = await request(app)
			.post("/refresh-token")
			.send({ refreshToken });

		expect(refreshAfterLogout.status).toBe(401);
	});

	it("deve executar fluxo completo de recuperação de senha", async () => {
		const oldPassword = testUserPassword;
		const newPassword = "SuperNovaSenha2024!";

		// 1. Solicitar recuperação
		const forgotResponse = await request(app)
			.post("/forgot-password")
			.send({ email: testUserEmail });

		expect(forgotResponse.status).toBe(200);

		// 2. Buscar código
		const resetCodeRecord = await prisma.resetCodes.findFirst({
			where: {
				email: testUserEmail,
				used: false
			},
			orderBy: {
				id: 'desc'
			}
		});

		const code = resetCodeRecord.code;

		// 3. Redefinir senha
		const resetResponse = await request(app)
			.post("/reset-password")
			.send({
				email: testUserEmail,
				code,
				password: newPassword
			});

		expect(resetResponse.status).toBe(200);

		// 4. Login com senha antiga deve falhar
		const oldLoginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: oldPassword
			});

		expect(oldLoginResponse.status).toBe(401);

		// 5. Login com nova senha deve funcionar
		const newLoginResponse = await request(app)
			.post("/login")
			.send({
				email: testUserEmail,
				password: newPassword
			});

		expect(newLoginResponse.status).toBe(200);
		
		// Atualizar senha para próximos testes
		testUserPassword = newPassword;
	});
});
