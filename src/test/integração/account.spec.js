import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';
import { prisma } from "../../config/prismaClient.js";

let account_faker = faker.finance.accountName();
let token;
let adminToken;
let accountInformation;
let userInformation;
let AccountCadastrada;
let adminUserId;

beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "thalysson140105@gmail.com",
      password: "Senha@12345",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
  adminToken = token;

  const adminResponse = await request(app)
    .get("/admin/users")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${adminToken}`);
  
  if (adminResponse.status === 200 && adminResponse.body.data.length > 0) {
    adminUserId = adminResponse.body.data[0].id;
    userInformation = adminResponse.body.data[0];
  }

}, 1000);

afterAll(async () => {
  await prisma.$disconnect();
});

function getRandomAccountType() {
  const types = ["Salário", "Corrente", "Poupança"];
  return types[Math.floor(Math.random() * types.length)];
}

describe("Listar contas (Admin) GET /admin/account", () => {
  describe("Caminho feliz", () => {
    it("deve listar todas as contas com sucesso", async () => {
      const response = await request(app)
        .get("/admin/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      if (response.body.data.length > 0) {
        accountInformation = response.body.data[0];
      }
    });

    it("deve listar contas com base no nome", async () => {
      if (!accountInformation) {
        const newAccount = await request(app)
          .post("/account")
          .set("Authorization", `Bearer ${token}`)
          .query({ userId: userInformation.id })
          .send({
            name: "Conta Teste",
            type: "Corrente",
            balance: 1000.00,
          });
        accountInformation = newAccount.body.data;
      }

      const response = await request(app)
        .get(`/admin/account?name=${accountInformation.name}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas com base no ID", async () => {
      const response = await request(app)
        .get(`/admin/account?id=${accountInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas com base no tipo", async () => {
      const response = await request(app)
        .get(`/admin/account?type=${accountInformation.type}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas limitando o tamanho da página", async () => {
      const response = await request(app)
        .get("/admin/account?limit=5")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(5);
    });

    it("deve listar contas da próxima página", async () => {
      const response = await request(app)
        .get("/admin/account?page=2")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar contas sem autorização", async () => {
      const response = await request(app)
        .get("/admin/account")
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar listar contas com parâmetros inválidos", async () => {
      const response = await request(app)
        .get("/admin/account?id=abc&name=123&type=123&balance=abc&page=abc&limit=abc&userId=abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar erro ao tentar listar contas de página inexistente", async () => {
      const response = await request(app)
        .get("/admin/account?page=999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message", "Nenhuma conta encontrada");
    });
  });
});

describe("Cadastrar conta POST /account", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar uma nova conta", async () => {
      const unique_account_name = `${account_faker}_${Date.now()}`;
      
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: unique_account_name,
          type: getRandomAccountType(),
          balance: 1000.00,
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(unique_account_name);
      expect(response.body.data.balance).toBe("1000");
      expect(response.body.data.userId).toBe(userInformation.id);
      
      AccountCadastrada = response.body.data;
    });

    it("deve cadastrar uma conta com ícone", async () => {
      const response = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: faker.finance.accountName(),
          type: getRandomAccountType(),
          balance: 500.00,
          icon: "path/to/icon.png",
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data.icon).toBeDefined();
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar conta com nome e tipo já existentes", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: AccountCadastrada.name,
          type: AccountCadastrada.type,
          balance: 1000.00,
        });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Já existe uma conta com nome semelhante e tipo para este usuário.");
    });

    it("deve retornar erro ao tentar cadastrar conta com parâmetros inválidos", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: "abc" })
        .send({
          name: 123,
          type: 123,
          balance: "abc",
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "name", message: "The account name must be a string/text." }),
          expect.objectContaining({ path: "type", message: "Account type must be a string." }),
          expect.objectContaining({ path: "balance", message: "Account balance must be a number." }),
        ])
      );
    });

    it("deve retornar erro ao tentar cadastrar conta com nome apenas numérico", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "123456",
          type: getRandomAccountType(),
          balance: 1000.00,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "name",
            message: "The account name must be a string/text.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar cadastrar conta sem autorização", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .query({ userId: userInformation.id })
        .send({
          name: faker.finance.accountName(),
          type: getRandomAccountType(),
          balance: 1000.00,
        });
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar cadastrar conta sem dados obrigatórios", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
    });
  });
});

describe("Listar contas do usuário GET /account/:id", () => {
  describe("Caminho feliz", () => {
    it("deve listar contas do usuário com sucesso", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        accountInformation = response.body.data[0];
      }
    });

    it("deve listar contas com base no nome", async () => {
      if (!accountInformation) {
        accountInformation = AccountCadastrada;
      }

      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          name: accountInformation.name 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas com base no ID", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          id: accountInformation.id 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas com base no tipo", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          type: accountInformation.type 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar contas pelo saldo", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          balance: AccountCadastrada.balance 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });

    it("deve listar contas pelo dono da conta", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });

    it("deve listar contas limitando o tamanho da página", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          limit: 10 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });

    it("deve listar contas da próxima página", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          page: 2 
        });
      
      // Como pode não haver dados na página 2, aceitar tanto 200 quanto 404
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar contas com parâmetros inválidos", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: "abc",
          id: "abc",
          name: "123",
          type: "123",
          balance: "abc",
          page: "abc",
          limit: "abc"
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar erro ao tentar listar contas sem autorização", async () => {
      const response = await request(app)
        .get(`/account/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .query({ userId: userInformation.id });
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar listar contas de usuário inexistente", async () => {
      const response = await request(app)
        .get("/account/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: 999999 });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message", "Nenhuma conta encontrada");
    });
  });
});

describe("Atualizar conta PATCH /account/:id", () => {
  let updatedName = "Conta Atualizada";
  let updatedType = getRandomAccountType();
  
  describe("Caminho feliz", () => {
    it("deve atualizar uma conta", async () => {
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          name: updatedName,
          type: updatedType,
          balance: 2000.50,
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(updatedName);
      expect(response.body.data.type).toBe(updatedType);
      expect(response.body.data.balance).toBe("2000.5");
    });

    it("deve atualizar apenas o nome da conta", async () => {
      const newName = "Novo Nome Conta";
      
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          name: newName,
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(newName);
    });

    it("deve atualizar apenas o saldo da conta", async () => {
      const newBalance = 5000.75;
      
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          balance: newBalance,
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.balance).toBe("5000.75");
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar conta com ID inválido", async () => {
      const response = await request(app)
        .patch("/account/abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: "abc",
          userId: userInformation.id 
        })
        .send({
          name: updatedName,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "The 'id' field must be an integer."
          })
        ])
      );
    });

    it("deve retornar erro ao tentar atualizar conta inexistente", async () => {
      const response = await request(app)
        .patch("/account/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: 999999,
          userId: userInformation.id 
        })
        .send({
          name: updatedName,
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Conta não encontrada");
    });

    it("deve retornar erro ao tentar atualizar conta com nome já existente", async () => {
      const anotherAccount = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Conta Teste Unique",
          type: "Poupança",
          balance: 1000.00,
        });

      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          name: "Conta Teste Unique",
          type: "Poupança",
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Já existe uma conta com nome e tipo iguais para este usuário.");
    });

    it("deve retornar erro ao tentar atualizar conta com nome inválido", async () => {
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          name: "123456",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "name",
            message: "The account name must contain words, not only numbers.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar atualizar conta sem autorização", async () => {
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        })
        .send({
          name: updatedName,
        });

      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar atualizar conta sem parâmetros obrigatórios", async () => {
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedName,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
    });
  });
});

describe("Deletar conta DELETE /account/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar uma conta", async () => {
      const response = await request(app)
        .delete(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.message).toBe("Conta e todos os dados relacionados foram deletados com sucesso");
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar conta com ID inválido", async () => {
      const response = await request(app)
        .delete("/account/abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: "abc",
          userId: userInformation.id 
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "The 'id' field must be an integer."
          })
        ])
      );
    });

    it("deve retornar erro ao tentar deletar conta inexistente", async () => {
      const response = await request(app)
        .delete("/account/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: 999999,
          userId: userInformation.id 
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Conta não encontrada");
    });

    it("deve retornar erro ao tentar deletar conta sem autorização", async () => {
      const testAccount = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Conta Para Deletar",
          type: "Corrente",
          balance: 1000.00,
        });

      const response = await request(app)
        .delete(`/account/${testAccount.body.data.id}`)
        .set("Content-Type", "application/json")
        .query({ 
          id: testAccount.body.data.id,
          userId: userInformation.id 
        });
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar deletar conta já deletada", async () => {
      const response = await request(app)
        .delete(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: AccountCadastrada.id,
          userId: userInformation.id 
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Conta não encontrada");
    });

    it("deve retornar erro ao tentar deletar conta sem parâmetros obrigatórios", async () => {
      const testAccount = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Conta Teste Delete",
          type: "Corrente",
          balance: 1000.00,
        });

      const response = await request(app)
        .delete(`/account/${testAccount.body.data.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
    });
  });
});