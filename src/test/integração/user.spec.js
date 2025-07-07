import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
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
let turmaValida
let cursoValido
let Usercadastrado

// Coloquei isso para conseguir obter o token antes de rodar todos os testes...
beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      Email: "thalysson140105@gmail.com",
      Senha: "Senha@12345",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;

  // const turma = await request(app)
  //   .get("/turmas")
  //   .set("Content-Type", "application/json")
  //   .set("Authorization", `Bearer ${token}`);
  // expect(turma.status).toBe(200);
  // turmaValida = turma.body.data.data[0]._id

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

describe("GET: Listar usuários", () => {
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
        .get(`/users?Nome=${userInformation.Nome}`)
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
        .get(`/users?Email=${userInformation.Email}`)
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
        .get(`/users?Nome=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "Nome",
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
        .get(`/users?Email=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "Email",
            message: "Email invalido",
          }),
        ])
      );
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
          Nome: user_faker,
          Email: email_faker,
          Senha: senha_faker,
          Avatar: null,
        });

      console.log("User Information:", response.body.message);

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

describe("Atualizar users PUT/:ID", () => {
  let data;
  describe("Caminho feliz", () => {
    it("deve atualizar um usuário", async () => {
      const matricula_faker_att = faker.string.numeric(13);
      let user_faker2 = faker.person.fullName();
      let email_faker2 = faker.internet.email();
      let senha_faker2 = faker.internet.password({
        length: 10,
        memorable: false,
        pattern: /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      });
      const response = await request(app)
        .put(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nome: user_faker2,
          Email: email_faker2,
          Senha: senha_faker2,
          Avatar: null,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.nome).toEqual(estudante_faker);
      expect(response.body.data.matricula).toEqual(matricula_faker_att);
      expect(response.body.data.ativo).toEqual(false);
      data = response.body.data
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar um user com a matrícula já existente", async () => {
      const response = await request(app)
        .put(`/users/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: data.nome,
          matricula: data.matricula,
          turma: data.turma._id,
          ativo: data.ativo,
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Dados iguais aos presentes no banco de dados");
    });
    it("deve retornar erro ao tentar atualizar um user com uma turma inexistente",
      async () => {
        const response = await request(app)
          .put(`/users/${estudantecadastrado._id}`)
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({
            nome: estudante_faker,
            matricula: matricula_faker,
            turma: "67fe7919879e77c0cd3f2dff",
            ativo: true,
          });
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("turma");
      });
    it("deve retornar erro ao tentar atualizar um user com um id não existente", async () => {
      const response = await request(app)
        .put(`/users/67fe7919879e77c0cd3f2dff`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          ativo: true,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("User não encontrado");
    });
  });
});

describe("Deletar users DELETE/:ID", () => {
  describe("Caminho feliz", () => {
    it("deve deletar um user", async () => {
      const response = await request(app)
        .delete(`/users/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Requisição bem-sucedida");
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar um user com um id não existente", async () => {
      const response = await request(app)
        .delete(`/users/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});
