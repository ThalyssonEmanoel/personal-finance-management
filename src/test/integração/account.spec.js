import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';
import { response } from "express";

let account_faker = faker.finance.accountName();
let token
let accountInformation
let userInformation
let AccountCadastrada

// Coloquei isso para conseguir obter o token antes de rodar todos os testes...
beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "thalysson140105@gmail.com",
      password: "Senha@12345",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;

  // Buscar informações do usuário cadastrado
  userInformation = await buscarUserCadastrado();

}, 1000);// Posso colocar um tempo de espera aqui

function getRandomAccountType() {
  const types = ["Salário", "Corrente", "Poupança"];
  return types[Math.floor(Math.random() * types.length)];
}

async function buscarUserCadastrado() {
  const response = await request(app)
    .get("/users")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`);
  if (response.status === 200 && response.body.data.length > 0) {
    return response.body.data[0]; // Retorna o primeiro usuário cadastrado
  } else {
    throw new Error("Nenhum usuário cadastrado encontrado.");
  }
}

describe("Cadastrar conta POST/", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar uma nova conta", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: account_faker,
          type: getRandomAccountType(),
          balance: 1000.00,
          userId: 1,
        });

      expect(response.status).toBe(201);
      AccountCadastrada = response.body.data

    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar uma conta o name e type já existentes", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: AccountCadastrada.name,
          type: AccountCadastrada.type,
          balance: 1000.00,
          userId: AccountCadastrada.userId,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Já existe uma conta com nome semelhante e tipo para este usuário.");
    });
    it("deve retornar erro ao tentar cadastrar uma conta com paramêtros inválidos", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: 123,
          type: 123,
          balance: "abc",
          userId: "abc",
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "name", message: "The account name must be a string/text." }),
          expect.objectContaining({ path: "type", message: "Account type must be a string." }),
          expect.objectContaining({ path: "balance", message: "Account balance must be a number." }),
          expect.objectContaining({ path: "userId", message: "User ID must be an integer." }),
        ])
      );
    });
  });
});

describe("Listar as contas GET", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todas as contas com sucesso", async () => {
      const response = await request(app)
        .get("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      accountInformation = response.body.data[0]
    });
    it("deve listar uma conta com base no Nome", async () => {
      const response = await request(app)
        .get(`/account?name=${accountInformation.name}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar uma conta com base no seu id", async () => {
      const response = await request(app)
        .get(`/account?id=${accountInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar uma conta com base no seu tipo", async () => {
      const response = await request(app)
        .get(`/account?type=${accountInformation.type}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar uma conta pelo saldo disponível nela.", async () => {
      const response = await request(app)
        .get(`/account?balance=${AccountCadastrada.balance}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      console.log("error", response.body.message);
      console.log("Informação", AccountCadastrada.balance);

      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });
    it("deve listar uma conta pelo dono da conta.", async () => {
      const response = await request(app)
        .get(`/account?userName=${userInformation.name}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });
    it("deve listar uma conta limitando o tamanho da página", async () => {
      const response = await request(app)
        .get(`/account?limit=10`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });
    it("deve listar as contas da próxima página", async () => {
      const response = await request(app)
        .get(`/account?page=2`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  })
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar uma conta com paramêtros inválidos", async () => {
      const response = await request(app)
        .get(`/account?id=asd&name=123&type=123&balance=asd&page=asd&limit=asd&userName=34`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "name", message: "The account name must contain words, not only numbers." }),
          expect.objectContaining({ path: "type", message: "The type must contain words, not only numbers." }),
          expect.objectContaining({ path: "balance", message: "The balance must be a number." }),
          expect.objectContaining({ path: "userName", message: "The user name must contain words, not only numbers." }),
          expect.objectContaining({ path: "userName", message: "The user name must contain words, not only numbers." }),
        ])
      );
    });
  });
});

describe("Atualizar conta patch/:ID", () => {
  let updatedName = "Conta Atualizada";
  let updatedType = getRandomAccountType();
  describe("Caminho feliz", () => {
    it("deve atualizar uma conta", async () => {
      const response = await request(app)
        .patch(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedName,
          type: updatedType,
          balance: 2000.50,
        });
      console.log("Error", response.body.message);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(updatedName);
      expect(response.body.data.type).toEqual(updatedType);
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar uma conta com id inválido", async () => {
      const response = await request(app)
        .patch(`/account/abc`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedName,
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "The 'id' field must be an integer."
          })
        ])
      );
    });
    it("deve retornar erro ao tentar atualizar uma conta não existente", async () => {
      const response = await request(app)
        .patch(`/account/9999999`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedName,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("Conta não encontrada");
    });
  });
});

describe("Deletar account DELETE/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar uma conta", async () => {
      const response = await request(app)
        .delete(`/account/${AccountCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Requisição bem sucedida.");
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar uma conta com id inválido", async () => {
      const response = await request(app)
        .delete(`/account/abc`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "The 'id' field must be an integer."
          })
        ])
      );
    });
    it("deve retornar erro ao tentar deletar uma conta não existente", async () => {
      const response = await request(app)
        .delete(`/account/9999999`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("Conta não encontrada");
    });
  });
});