import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';
import { response } from "express";

let user_faker = faker.person.fullName();
let email_faker = faker.internet.email();
let senha_faker = faker.internet.password({
  length: 10,
  memorable: false,
  pattern: /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
});
let token
let accountInformation
let User
let userInformation

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

function gerarSenhaForte() {
  const maiuscula = faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const minuscula = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz');
  const numero = faker.string.fromCharacters('0123456789');
  const especial = faker.string.fromCharacters('!@#$%^&*()_+-=[]{}|;:,.<>?');
  // Gera mais caracteres aleatórios para completar o tamanho mínimo
  const resto = faker.internet.password({ length: 4, memorable: false });

  // Embaralha a senha para não ficar sempre na mesma ordem
  const senha = [maiuscula, minuscula, numero, especial, ...resto].join('');
  return senha.split('').sort(() => 0.5 - Math.random()).join('');
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
        .get(`/account?balance=${accountInformation.balance}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
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

describe("Cadastrar conta POST/", () => {
  let senha_faker = gerarSenhaForte();
  describe("Caminho feliz", () => {
    it("deve cadastrar uma nova conta", async () => {
      const response = await request(app)
        .post("/account")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: faker.company.name(),
          type: "pessoal",
          balance: 1000,
          userId: userInformation.id,
        });

      expect(response.status).toBe(201);
      Usercadastrado = response.body.data

    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar um usuários com o Email já existente", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: user_faker,
          Email: email_faker,
          Senha: senha_faker,
          Avatar: null,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Email já cadastrado");
    });
    it("deve retornar erro ao tentar cadastrar um usuários com uma senha inválida", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: user_faker,
          Email: "RobertoCarlos123231@gmail.com",
          Senha: "abc",
          Avatar: null,
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "Senha",
            message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
          }),
        ])
      );
    });
  });
});

describe("Atualizar users patch/:ID", () => {
  let data;
  describe("Caminho feliz", () => {
    it("deve atualizar um usuário", async () => {
      let user_faker2 = faker.person.fullName();
      let email_faker2 = faker.internet.email();
      let senha_faker2 = gerarSenhaForte();
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: user_faker2,
          Email: email_faker2,
          Senha: senha_faker2,
          Avatar: null,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.Nome).toEqual(user_faker2);
      expect(response.body.data.Email).toEqual(email_faker2);
      data = response.body.data
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar um usuário com o Email já existente em outro usuário", async () => {
      const response = await request(app)
        .patch(`/users/1`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: data.Nome,
          Email: data.Email,
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Email já cadastrado por outro usuário");
    });
    it("deve retornar erro ao tentar atualizar um usuário com o mesmo email já cadastrado", async () => {
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: data.Nome,
          Email: data.Email,
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Email a ser atualizado não pode ser o mesmo que o existente no sistema.");
    });
    it("deve retornar erro ao tentar atualizar um user com um id não existente", async () => {
      const response = await request(app)
        .patch(`/users/67fe7919879e77c0cd3f2dff`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: data.Nome,
          Email: data.Email,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "O campo 'id' deve ser um número inteiro.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar atualizar um user com um id não existente", async () => {
      const response = await request(app)
        .patch(`/users/123456789987456123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: data.Nome,
          Email: data.Email,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });
  });
});

describe("Deletar users DELETE/:ID", () => {
  describe("Caminho feliz", () => {
    it("deve deletar um user", async () => {
      const response = await request(app)
        .delete(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Requisição bem sucedida.");
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar um user com um id não existente", async () => {
      const response = await request(app)
        .delete(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });
  });
});
