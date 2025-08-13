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
let token;
let adminToken;
let userInformation;
let Usercadastrado;
let adminUserId;

// Obter token de admin antes de rodar todos os testes
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
  }

}, 1000);

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

describe("Listar usuários (Admin) GET /admin/users", () => {
  describe("Caminho feliz", () => {
    it("deve listar todos os usuários com sucesso", async () => {
      const response = await request(app)
        .get("/admin/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        userInformation = response.body.data[0];
      }
    });

    it("deve listar usuários com base no nome", async () => {
      if (!userInformation) {
        const newUser = await request(app)
          .post("/users")
          .send({
            name: "Test User",
            email: "test@example.com",
            password: "TestPass@123",
            avatar: null,
          });
        userInformation = newUser.body.data;
      }

      const response = await request(app)
        .get(`/admin/users?name=${userInformation.name}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar usuários com base no ID", async () => {
      const response = await request(app)
        .get(`/admin/users?id=${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar usuários com base no email", async () => {
      const response = await request(app)
        .get(`/admin/users?email=${userInformation.email}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar usuários limitando o tamanho da página", async () => {
      const response = await request(app)
        .get("/admin/users?limit=5")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(5);
    });

    it("deve listar usuários da próxima página", async () => {
      const response = await request(app)
        .get("/admin/users?page=2")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar usuários com nome inválido", async () => {
      const response = await request(app)
        .get("/admin/users?name=123")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(400);
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

    it("deve retornar erro ao tentar listar usuários com ID inválido", async () => {
      const response = await request(app)
        .get("/admin/users?id=abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(400);
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

    it("deve retornar erro ao tentar listar usuários com email inválido", async () => {
      const response = await request(app)
        .get("/admin/users?email=123")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(400);
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

    it("deve retornar erro ao tentar listar usuários sem autorização", async () => {
      const response = await request(app)
        .get("/admin/users")
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar listar usuários de página inexistente", async () => {
      const response = await request(app)
        .get("/admin/users?page=999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message", "Nenhum usuário encontrado");
    });
  });
});

describe("Obter usuário por ID GET /users/:id", () => {
  describe("Caminho feliz", () => {
    it("deve obter um usuário pelo ID", async () => {
      if (!userInformation) {
        userInformation = { id: adminUserId };
      }

      const response = await request(app)
        .get(`/users/${userInformation.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(userInformation.id);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar obter usuário com ID inválido", async () => {
      const response = await request(app)
        .get("/users/abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar erro ao tentar obter usuário inexistente", async () => {
      const response = await request(app)
        .get("/users/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message", "Usuário não encontrado");
    });

    it("deve retornar erro ao tentar obter usuário sem autorização", async () => {
      const response = await request(app)
        .get(`/users/${userInformation?.id || 1}`)
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(401);
    });
  });
});

describe("Cadastrar usuários POST /users", () => {
  let senha_faker = gerarSenhaForte();
  
  describe("Caminho feliz", () => {
    it("deve cadastrar um usuário", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          name: user_faker,
          email: email_faker,
          password: senha_faker,
          avatar: null,
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(email_faker);
      expect(response.body.data.name).toBe(user_faker);
      expect(response.body.data).not.toHaveProperty('password');
      
      Usercadastrado = response.body.data;
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar usuário com email já existente", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          name: user_faker,
          email: email_faker, 
          password: senha_faker,
          avatar: null,
        });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Email já cadastrado");
    });

    it("deve retornar erro ao tentar cadastrar usuário com senha inválida", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          name: user_faker,
          email: faker.internet.email(),
          password: "123", 
          avatar: null,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "password",
            message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar cadastrar usuário com nome inválido", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          name: "123456", 
          email: faker.internet.email(),
          password: gerarSenhaForte(),
          avatar: null,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "name",
            message: "O nome precisa ser em palavras e não números.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar cadastrar usuário com email inválido", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          name: faker.person.fullName(),
          email: "email-invalido", 
          password: gerarSenhaForte(),
          avatar: null,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
            message: "Email invalido",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar cadastrar usuário sem dados obrigatórios", async () => {
      const response = await request(app)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
    });
  });
});

describe("Atualizar usuário PATCH /users/:id", () => {
  let updatedUserData;
  
  describe("Caminho feliz", () => {
    it("deve atualizar um usuário", async () => {
      let user_faker2 = faker.person.fullName();
      let email_faker2 = faker.internet.email();
      
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: user_faker2,
          email: email_faker2,
          avatar: null,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(user_faker2);
      expect(response.body.data.email).toBe(email_faker2);
      expect(response.body.data).not.toHaveProperty('password');
      
      updatedUserData = response.body.data;
    });

    it("deve atualizar apenas o nome do usuário", async () => {
      let newName = faker.person.fullName();
      
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: newName,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(newName);
    });

    it("deve atualizar apenas o email do usuário", async () => {
      let newEmail = faker.internet.email();
      
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: newEmail,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.email).toBe(newEmail);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar usuário com email já existente", async () => {
      const anotherUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: gerarSenhaForte(),
        });

      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: anotherUser.body.data.email,
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Email já cadastrado por outro usuário");
    });

    it("deve retornar erro ao tentar atualizar usuário inexistente", async () => {
      const response = await request(app)
        .patch("/users/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: faker.person.fullName(),
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Usuário não encontrado");
    });

    it("deve retornar erro ao tentar atualizar usuário com ID inválido", async () => {
      const response = await request(app)
        .patch("/users/abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: faker.person.fullName(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "O campo 'id' deve ser um número inteiro.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar atualizar usuário com nome inválido", async () => {
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "123456", 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "name",
            message: "O nome precisa ser em palavras e não números.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar atualizar usuário com email inválido", async () => {
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "email-invalido", 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
            message: "Email invalido",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar atualizar usuário sem autorização", async () => {
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .send({
          name: faker.person.fullName(),
        });

      expect(response.status).toBe(401);
    });
  });
});

describe("Alterar senha PATCH /users/:id/change-password", () => {
  describe("Caminho feliz", () => {
    it("deve alterar a senha do usuário", async () => {
      const currentPassword = gerarSenhaForte();
      const newPassword = gerarSenhaForte();
      const newUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: currentPassword,
        });

      const loginResponse = await request(app)
        .post("/login")
        .send({
          email: newUser.body.data.email,
          password: currentPassword,
        });

      const userToken = loginResponse.body.data.accessToken;

      const response = await request(app)
        .patch(`/users/${newUser.body.data.id}/change-password`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: newPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.message).toBe("Senha alterada com sucesso.");
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar alterar senha com senha atual incorreta", async () => {
      // Primeiro criar um usuário para teste
      const testUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "SenhaCorreta@123",
        });

      // Fazer login para obter o token
      const loginResponse = await request(app)
        .post("/login")
        .send({
          email: testUser.body.data.email,
          password: "SenhaCorreta@123",
        });

      const userToken = loginResponse.body.data.accessToken;
      const newPassword = gerarSenhaForte();

      const response = await request(app)
        .patch(`/users/${testUser.body.data.id}/change-password`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: "SenhaErrada@123", // senha incorreta
          newPassword: newPassword,
          confirmPassword: newPassword, // mesma senha para evitar erro de validação
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Senha atual incorreta.");
    });

    it("deve retornar erro ao tentar alterar senha com confirmação diferente", async () => {
      // Criar um usuário para teste
      const testUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "SenhaCorreta@123",
        });

      // Fazer login para obter o token
      const loginResponse = await request(app)
        .post("/login")
        .send({
          email: testUser.body.data.email,
          password: "SenhaCorreta@123",
        });

      const userToken = loginResponse.body.data.accessToken;
      const newPassword = gerarSenhaForte();

      const response = await request(app)
        .patch(`/users/${testUser.body.data.id}/change-password`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: "SenhaCorreta@123",
          newPassword: newPassword,
          confirmPassword: "SenhaDiferente@123", // confirmação diferente
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "confirmPassword",
            message: "A nova senha e a confirmação de senha devem ser iguais.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar alterar senha com nova senha inválida", async () => {
      // Criar um usuário para teste
      const testUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "SenhaCorreta@123",
        });

      // Fazer login para obter o token
      const loginResponse = await request(app)
        .post("/login")
        .send({
          email: testUser.body.data.email,
          password: "SenhaCorreta@123",
        });

      const userToken = loginResponse.body.data.accessToken;

      const response = await request(app)
        .patch(`/users/${testUser.body.data.id}/change-password`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: "SenhaCorreta@123",
          newPassword: "123", // senha muito simples
          confirmPassword: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "newPassword",
            message: "A nova senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar alterar senha sem autorização", async () => {
      const response = await request(app)
        .patch(`/users/${Usercadastrado.id}/change-password`)
        .set("Content-Type", "application/json")
        .send({
          currentPassword: gerarSenhaForte(),
          newPassword: gerarSenhaForte(),
          confirmPassword: gerarSenhaForte(),
        });

      expect(response.status).toBe(401);
    });
  });
});

describe("Deletar usuário DELETE /users/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar um usuário", async () => {
      const response = await request(app)
        .delete(`/users/${Usercadastrado.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.message).toBe("Usuário e todos os dados relacionados foram deletados com sucesso");
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar usuário inexistente", async () => {
      const response = await request(app)
        .delete("/users/999999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Usuário não encontrado");
    });

    it("deve retornar erro ao tentar deletar usuário com ID inválido", async () => {
      const response = await request(app)
        .delete("/users/abc")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "O campo 'id' deve ser um número inteiro.",
          }),
        ])
      );
    });

    it("deve retornar erro ao tentar deletar usuário sem autorização", async () => {
      const userToDelete = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: gerarSenhaForte(),
        });

      const response = await request(app)
        .delete(`/users/${userToDelete.body.data.id}`)
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(401);
    });

    it("deve retornar erro ao tentar deletar usuário já deletado", async () => {
      const response = await request(app)
        .delete(`/users/${Usercadastrado.id}`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Usuário não encontrado");
    });
  });
});

describe("Rotas de Admin - Cadastrar usuário POST /admin/users", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar um usuário admin", async () => {
      const adminUserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: gerarSenhaForte(),
        isAdmin: true,
      };

      const response = await request(app)
        .post("/admin/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(adminUserData);

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(adminUserData.email);
      expect(response.body.data.name).toBe(adminUserData.name);
      expect(response.body.data.isAdmin).toBe(true);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it("deve cadastrar um usuário comum via admin", async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: gerarSenhaForte(),
        isAdmin: false,
      };

      const response = await request(app)
        .post("/admin/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data.isAdmin).toBe(false);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar usuário sem ser admin", async () => {
      const commonUser = await request(app)
        .post("/users")
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: gerarSenhaForte(),
        });

      const loginResponse = await request(app)
        .post("/login")
        .send({
          email: commonUser.body.data.email,
          password: gerarSenhaForte(),
        });

      if (loginResponse.status === 200) {
        const commonUserToken = loginResponse.body.data.accessToken;

        const response = await request(app)
          .post("/admin/users")
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${commonUserToken}`)
          .send({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: gerarSenhaForte(),
          });

        expect(response.status).toBe(403);
      }
    });
  });
});

describe("Rotas de Admin - Atualizar usuário PATCH /admin/users/:id", () => {
  let adminCreatedUser;

  beforeAll(async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: gerarSenhaForte(),
      isAdmin: false,
    };

    const response = await request(app)
      .post("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(userData);

    adminCreatedUser = response.body.data;
  });

  describe("Caminho feliz", () => {
    it("deve atualizar usuário via admin", async () => {
      const updateData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        isAdmin: true,
      };

      const response = await request(app)
        .patch(`/admin/users/${adminCreatedUser.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
      expect(response.body.data.isAdmin).toBe(true);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar usuário sem ser admin", async () => {
      const response = await request(app)
        .patch(`/admin/users/${adminCreatedUser.id}`)
        .set("Content-Type", "application/json")
        .send({
          name: faker.person.fullName(),
        });

      expect(response.status).toBe(401);
    });
  });
});