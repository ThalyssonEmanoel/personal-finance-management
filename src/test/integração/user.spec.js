import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';

let user_faker = faker.person.fullName();
let email_faker = faker.internet.email();
let senha_faker = faker.internet.password({
  length: 10,
  memorable: false,
  pattern: /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
});
let token
let userInformation
let Usercadastrado

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

describe("Listar usuários GET", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todos os usuários com sucesso", async () => {
      const response = await request(app)
        .get("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      userInformation = response.body.data[0]
    });
    it("deve listar um usuário com base no Nome", async () => {
      const response = await request(app)
        .get(`/users?Nome=${userInformation.name}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um usuário com base no seu id", async () => {
      const response = await request(app)
        .get(`/users?id=${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um usuário com base no Email", async () => {
      const response = await request(app)
        .get(`/users?email=${userInformation.email}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um usuários limitando o tamanho da página", async () => {
      const response = await request(app)
        .get(`/users?limit=10`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.limite).toBe(10);
    });
    it("deve listar os usuários da próxima página", async () => {
      const response = await request(app)
        .get(`/users?pagina=2`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  })
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar um usuário com Nome inválido", async () => {
      const response = await request(app)
        .get(`/users?name=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "name",
            message: "O nome precisa ser em palavras e não números.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um usuário com o ID inválido.", async () => {
      const response = await request(app)
        .get(`/users?id=abc`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "O campo 'id' deve ser um número inteiro.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um usuário com Email inválido.", async () => {
      const response = await request(app)
        .get(`/users?email=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
            message: "Email invalido",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar sem ter usuários existents.", async () => {
      const response = await request(app)
        .get(`/users?page=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("Nenhum usuário encontrado");
    });
  });
});

describe("Cadastrar usuários POST/", () => {
  let senha_faker = gerarSenhaForte();
  describe("Caminho feliz", () => {
    it("deve cadastrar um usuário", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: user_faker,
          email: email_faker,
          password: senha_faker,
          avatar: null,
        });

      expect(response.status).toBe(201);
      Usercadastrado = response.body.data

    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar um usuário com o Email já existente", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: user_faker,
          email: email_faker,
          password: senha_faker,
          avatar: null,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Email já cadastrado");
    });
    it("deve retornar erro ao tentar cadastrar um usuário com uma senha inválida", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: user_faker,
          email: "RobertoCarlos123231@gmail.com",
          password: "abc",
          avatar: null,
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "password",
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
          name: user_faker2,
          email: email_faker2,
          password: senha_faker2,
          avatar: null,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(user_faker2);
      expect(response.body.data.email).toEqual(email_faker2);
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
          name: data.name,
          email: data.email,
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
          name: data.name,
          email: data.email,
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
          name: data.name,
          email: data.email,
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
          name: data.name,
          email: data.email,
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
