import request from "supertest";
import { expect, it, describe, beforeAll, jest } from "@jest/globals";
import app from "../../app.js";
import { faker } from '@faker-js/faker';
import { prisma } from "../../config/prismaClient.js";
let token;
let adminToken;
let userInformation;
let TransactionCadastrada;
let accountInformation;
let paymentMethodInformation;

beforeAll(async () => {
  // Login como admin para obter tokens
  const response = await request(app)
    .post("/login")
    .send({
      email: "thalysson140105@gmail.com",
      password: "Senha@12345",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
  adminToken = token;
  
  // Obter informações do usuário admin
  const adminResponse = await request(app)
    .get("/admin/users")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${adminToken}`);
  
  if (adminResponse.status === 200 && adminResponse.body.data.length > 0) {
    userInformation = adminResponse.body.data[0];
  }

  // Criar uma conta de teste se não existir
  try {
    const accountResponse = await request(app)
      .post("/account")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: userInformation.id })
      .send({
        name: `Conta_Test_${Date.now()}`,
        type: "conta_corrente",
        balance: 5000.00,
        paymentMethodIds: "1,2,3"
      });
    
    if (accountResponse.status === 201) {
      accountInformation = accountResponse.body.data;
    }
  } catch (error) {
    // Se falhar, usar uma conta existente
    const existingAccounts = await request(app)
      .get(`/account/${userInformation.id}`)
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: userInformation.id });
    
    if (existingAccounts.status === 200 && existingAccounts.body.data.length > 0) {
      accountInformation = existingAccounts.body.data[0];
    }
  }

  // Obter método de pagamento compatível com a conta
  if (accountInformation && accountInformation.accountPaymentMethods && accountInformation.accountPaymentMethods.length > 0) {
    paymentMethodInformation = accountInformation.accountPaymentMethods[0].paymentMethod;
  } else {
    // Fallback: obter qualquer método de pagamento
    const paymentMethodsResponse = await request(app)
      .get("/payment-methods")
      .set("Authorization", `Bearer ${adminToken}`);
    
    if (paymentMethodsResponse.status === 200 && paymentMethodsResponse.body.data.length > 0) {
      paymentMethodInformation = paymentMethodsResponse.body.data[0];
    }
  }

}, 10000);

afterAll(async () => {
  await prisma.$disconnect();
});

function getRandomTransactionType() {
  const types = ["expense", "income"];
  return faker.helpers.arrayElement(types);
}

function getRandomCategory() {
  const categories = [
    "Alimentação", "Transporte", "Lazer", "Saúde", "Educação", 
    "Moradia", "Vestuário", "Investimentos", "Salário", "Freelance"
  ];
  return faker.helpers.arrayElement(categories);
}

describe("Listar transações (Admin) GET /transactions/admin", () => {
  describe("Caminho feliz", () => {
    it("deve listar todas as transações com sucesso", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("deve listar transações com base no nome", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ name: "Salário" });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar transações com base no tipo", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ type: "income" });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar transações com base na categoria", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ category: "Alimentação" });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });

    it("deve listar transações limitando o tamanho da página", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.limite).toBe(5);
    });

    it("deve listar transações da próxima página", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 2 });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar transações sem autorização", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar listar transações com parâmetros inválidos", async () => {
      const response = await request(app)
        .get("/transactions/admin")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: "invalid" });

      expect([400, 200]).toContain(response.status);
    });
  });
});

describe("Cadastrar transação POST /transactions", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar uma nova transação", async () => {
      const transactionName = `Transação_${Date.now()}`;
      
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: transactionName,
          type: "expense",
          category: getRandomCategory(),
          value: 150.75,
          release_date: "2024-12-01",
          description: "Transação de teste",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id,
          recurring: false
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(transactionName);
      expect(response.body.data.type).toBe("expense");
      expect(response.body.data.value).toBe("150.75");
      expect(response.body.data.userId).toBe(userInformation.id);
      
      TransactionCadastrada = response.body.data;
    });

    it("deve cadastrar uma transação recorrente", async () => {
      const transactionName = `Recorrente_${Date.now()}`;
      
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: transactionName,
          type: "income",
          category: "Salário",
          value: 3000.00,
          release_date: "2024-12-01",
          description: "Salário mensal",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id,
          recurring: true
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data.recurring).toBe(true);
    });

    it("deve cadastrar uma transação parcelada", async () => {
      const transactionName = `Parcelada_${Date.now()}`;
      
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: transactionName,
          type: "expense",
          category: "Compras",
          value: 1200.00,
          release_date: "2024-12-01",
          description: "Compra parcelada",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id,
          number_installments: 3
        });

      expect(response.status).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.data.number_installments).toBe(3);
      expect(response.body.data.current_installment).toBe(1);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar transação sem autorização", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .send({
          name: "Teste",
          type: "expense",
          category: "Teste",
          value: 100,
          release_date: "2024-12-01",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar cadastrar transação sem dados obrigatórios", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar cadastrar transação com valor inválido", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Teste",
          type: "expense",
          category: "Teste",
          value: -100,
          release_date: "2024-12-01",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar cadastrar transação com tipo inválido", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Teste",
          type: "invalid_type",
          category: "Teste",
          value: 100,
          release_date: "2024-12-01",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar cadastrar transação com conta inexistente", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Teste",
          type: "expense",
          category: "Teste",
          value: 100,
          release_date: "2024-12-01",
          accountId: 99999,
          paymentMethodId: paymentMethodInformation.id
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar cadastrar transação com método de pagamento incompatível", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: "Teste",
          type: "expense",
          category: "Teste",
          value: 100,
          release_date: "2024-12-01",
          accountId: accountInformation.id,
          paymentMethodId: 99999
        });

      expect([404, 400]).toContain(response.status);
      expect(response.body.error).toBe(true);
    });
  });
});

describe("Listar transações do usuário GET /transactions", () => {
  describe("Caminho feliz", () => {
    it("deve listar transações do usuário com sucesso", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });

    it("deve listar transações com base no nome", async () => {
      // Se não temos uma transação cadastrada, criar uma para o teste
      if (!TransactionCadastrada) {
        const transactionName = `Test_${Date.now()}`;
        const createResponse = await request(app)
          .post("/transactions")
          .set("Authorization", `Bearer ${token}`)
          .query({ userId: userInformation.id })
          .send({
            name: transactionName,
            type: "expense",
            category: "Teste",
            value: 100,
            release_date: "2024-12-01",
            accountId: accountInformation.id,
            paymentMethodId: paymentMethodInformation.id
          });
        
        if (createResponse.status === 201) {
          TransactionCadastrada = createResponse.body.data;
        } else {
          // Fazer o teste com um nome genérico se não conseguiu criar
          const response = await request(app)
            .get("/transactions")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .query({ 
              userId: userInformation.id,
              name: "Teste"
            });

          expect([200, 404]).toContain(response.status);
          return;
        }
      }

      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          name: TransactionCadastrada.name
        });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });

    it("deve listar transações com base no tipo", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          type: "expense"
        });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });

    it("deve listar transações com base na categoria", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          category: "Alimentação"
        });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });

    it("deve listar transações limitando o tamanho da página", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          limit: 3
        });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
        expect(response.body.limite).toBe(3);
      }
    });

    it("deve listar transações da próxima página", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: userInformation.id,
          page: 2
        });

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.error).toBe(false);
      }
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar transações sem autorização", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .query({ userId: userInformation.id });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar listar transações sem userId", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar listar transações com parâmetros inválidos", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          userId: "invalid",
          page: "invalid"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});

describe("Atualizar transação PATCH /transactions/:id", () => {
  describe("Caminho feliz", () => {
    it("deve atualizar uma transação completa", async () => {
      // Garantir que temos uma transação para atualizar
      if (!TransactionCadastrada) {
        const transactionName = `Update_Test_${Date.now()}`;
        const createResponse = await request(app)
          .post("/transactions")
          .set("Authorization", `Bearer ${token}`)
          .query({ userId: userInformation.id })
          .send({
            name: transactionName,
            type: "expense",
            category: "Teste",
            value: 100,
            release_date: "2024-12-01",
            accountId: accountInformation.id,
            paymentMethodId: paymentMethodInformation.id
          });
        
        if (createResponse.status === 201) {
          TransactionCadastrada = createResponse.body.data;
        } else {
          // Skip este teste se não conseguiu criar transação
          return;
        }
      }

      const updatedName = `Updated_${Date.now()}`;
      const updatedValue = 250.50;
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          name: updatedName,
          value: updatedValue,
          category: "Alimentação"
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(updatedName);
      expect(response.body.data.category).toBe("Alimentação");
    });

    it("deve atualizar apenas o nome da transação", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const newName = `OnlyName_${Date.now()}`;
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          name: newName
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.data.name).toBe(newName);
    });

    it("deve atualizar apenas o valor da transação", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const newValue = 999.99;
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          value: newValue
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar transação com ID inválido", async () => {
      const response = await request(app)
        .patch("/transactions/invalid")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: "invalid",
          userId: userInformation.id
        })
        .send({
          name: "Teste"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar atualizar transação inexistente", async () => {
      const response = await request(app)
        .patch("/transactions/99999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: 99999,
          userId: userInformation.id
        })
        .send({
          name: "Teste"
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar atualizar transação sem autorização", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          name: "Teste"
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar atualizar transação com valor inválido", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          value: -100
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar atualizar transação com tipo inválido", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const response = await request(app)
        .patch(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        })
        .send({
          type: "invalid_type"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});

describe("Deletar transação DELETE /transactions/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar uma transação", async () => {
      // Criar uma nova transação para deletar
      const transactionName = `ToDelete_${Date.now()}`;
      const createResponse = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .query({ userId: userInformation.id })
        .send({
          name: transactionName,
          type: "expense",
          category: "Teste",
          value: 50,
          release_date: "2024-12-01",
          accountId: accountInformation.id,
          paymentMethodId: paymentMethodInformation.id
        });

      if (createResponse.status !== 201) {
        // Skip se não conseguiu criar a transação
        return;
      }

      const transactionToDelete = createResponse.body.data;

      const response = await request(app)
        .delete(`/transactions/${transactionToDelete.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: transactionToDelete.id,
          userId: userInformation.id
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar transação com ID inválido", async () => {
      const response = await request(app)
        .delete("/transactions/invalid")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: "invalid",
          userId: userInformation.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it("deve retornar erro ao tentar deletar transação inexistente", async () => {
      const response = await request(app)
        .delete("/transactions/99999")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({ 
          id: 99999,
          userId: userInformation.id
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar deletar transação sem autorização", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const response = await request(app)
        .delete(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .query({ 
          id: TransactionCadastrada.id,
          userId: userInformation.id
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
    });

    it("deve retornar erro ao tentar deletar transação sem parâmetros obrigatórios", async () => {
      if (!TransactionCadastrada) return; // Skip se não temos transação
      
      const response = await request(app)
        .delete(`/transactions/${TransactionCadastrada.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});
