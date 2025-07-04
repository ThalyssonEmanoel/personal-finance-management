import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';

let token
let userInformation
const user_faker = faker.person.fullName();
const id_faker = faker.string.numeric(13);
let turmaValida
let cursoValido
let estudantecadastrado

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

  // const curso = await request(app)
  //   .get("/cursos")
  //   .set("Content-Type", "application/json")
  //   .set("Authorization", `Bearer ${token}`);
  // expect(turma.status).toBe(200);
  // cursoValido = curso.body.data.data[0]._id

}, 1000);// Posso colocar um tempo de espera aqui


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
      console.log("User Information:", userInformation);
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
    it("deve retornar erro ao tentar listar um user com status inválido", async () => {
      const response = await request(app)
        .get(`/users?ativo=asd`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "ativo",
            message: "O campo 'ativo' deve ser 'true' ou 'false'.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um user com matrícula menor que 13 caracteres", async () => {
      const response = await request(app)
        .get(`/users?matricula=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "matricula",
            message: "Matrícula deve ter no mínimo 13 caracteres",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um user com matrícula maior que 18 caracteres", async () => {
      const response = await request(app)
        .get(`/users?matricula=12312321312313131312321123123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "matricula",
            message: "Matrícula deve ter no máximo 18 caracteres",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um user com uma matrícula não existente.", async () => {
      const response = await request(app)
        .get(`/users?matricula=12312313221313`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
    it("deve retornar erro ao tentar listar um user com nome com apenas números", async () => {
      const response = await request(app)
        .get(`/users?nome=12312313212`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "nome",
            message: "O nome precisa ser em palavras e não números.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um user com um nome não existente.", async () => {
      const response = await request(app)
        .get(`/users?nome=filipiiiino`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
    it("deve retornar erro ao tentar listar um user com uma turma no formato inválido.", async () => {
      const response = await request(app)
        .get(`/users?turma=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "turma",
            message: "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um user com uma turma não existente", async () => {
      const response = await request(app)
        .get(`/users?turma=67f941218ec90b300c697c77`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});

describe("Cadastrar users POST/", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar um user", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          curso: cursoValido,
          ativo: true,
        });

      expect(response.status).toBe(201);
      estudantecadastrado = response.body.data
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar um user com a matrícula já existente", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          curso: cursoValido,
          ativo: true,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("matricula");
    });
    it("deve retornar erro ao tentar cadastrar um user com uma turma inexistente", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: "67fe7919879e77c0cd3f2dff",
          curso: cursoValido,
          ativo: true,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("turma");
    });
  });
});

describe("Atualizar users PUT/:ID", () => {
  let data;
  describe("Caminho feliz", () => {
    it("deve atualizar um user", async () => {
      const matricula_faker_att = faker.string.numeric(13);
      const response = await request(app)
        .put(`/users/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker_att,
          turma: turmaValida,
          ativo: false,
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
