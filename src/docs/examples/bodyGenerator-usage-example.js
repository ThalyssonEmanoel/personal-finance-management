/**
 * EXEMPLO DE USO DAS NOVAS FUNÇÕES DE BODY GENERATOR
 * Este arquivo mostra como usar as novas funcionalidades do parameterGenerator
 */

import parameterGenerator from "../utils/parameterGenerator.js";

// ===========================================
// 1. EXEMPLOS DE REQUEST BODIES
// ===========================================

// REQUEST BODY PARA CRIAR USUÁRIO
const createUserBody = parameterGenerator.getCreateRequestBody('Users', {
  excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
  requiredFields: ['Nome', 'Email', 'Senha'],
  customDescriptions: {
    Nome: "Nome completo do usuário",
    Email: "Email único do usuário",
    Senha: "Senha do usuário (mínimo 8 caracteres)",
    Avatar: "Avatar do usuário (opcional)"
  },
  customValidations: {
    Email: { format: "email" },
    Senha: { minLength: 8, pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" },
    Nome: { minLength: 2, maxLength: 45 }
  }
});

// REQUEST BODY PARA ATUALIZAR USUÁRIO
const updateUserBody = parameterGenerator.getUpdateRequestBody('Users', {
  excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
  customDescriptions: {
    Nome: "Nome completo do usuário (opcional)",
    Email: "Email único do usuário (opcional)",
    Senha: "Nova senha do usuário (opcional)",
    Avatar: "Novo avatar do usuário (opcional)"
  }
});

// REQUEST BODY COM MULTIPART (UPLOAD DE ARQUIVO)
const multipartUserBody = parameterGenerator.getMultipartRequestBody('Users', {
  excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
  fileFields: ['Avatar'],
  requiredFields: ['Nome', 'Email', 'Senha'],
  title: 'CreateUserFormRequest'
});

// ===========================================
// 2. EXEMPLOS DE RESPONSE SCHEMAS
// ===========================================

// SCHEMA DE RESPOSTA PARA USUÁRIO
const userResponseSchema = parameterGenerator.getResponseSchema('Users', {
  excludeFields: ['Senha', 'Despesas', 'Despesas_recorrentes'],
  title: 'UserResponse',
  customDescriptions: {
    id: "ID único do usuário",
    Nome: "Nome completo do usuário",
    Email: "Email do usuário",
    Avatar: "URL do avatar do usuário"
  }
});

// ===========================================
// 3. EXEMPLO DE SCHEMAS COMPLETOS
// ===========================================

// GERAR TODOS OS SCHEMAS DE UMA VEZ
const allUserSchemas = parameterGenerator.getAllSchemas('Users', {
  includeCreate: true,
  includeUpdate: true,
  includeResponse: true,
  includeMultipart: true,
  fileFields: ['Avatar'],
  excludeFields: ['Despesas', 'Despesas_recorrentes'],
  customDescriptions: {
    Nome: "Nome completo do usuário",
    Email: "Email único do usuário",
    Senha: "Senha do usuário",
    Avatar: "Avatar do usuário"
  },
  customValidations: {
    Email: { format: "email" },
    Senha: { minLength: 8 },
    Nome: { minLength: 2, maxLength: 45 }
  }
});

// ===========================================
// 4. EXEMPLO DE USO EM ROTA SWAGGER
// ===========================================

const exampleRoute = {
  "/users": {
    post: {
      tags: ["Users"],
      summary: "Create new user",
      // USANDO O GENERATOR AUTOMATICAMENTE
      requestBody: parameterGenerator.getMultipartRequestBody('Users', {
        excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
        fileFields: ['Avatar'],
        requiredFields: ['Nome', 'Email', 'Senha']
      }),
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                // Referência ao schema gerado automaticamente
                $ref: "#/components/schemas/UserResponse"
              }
            }
          }
        }
      }
    }
  },
  "/users/{id}": {
    put: {
      tags: ["Users"],
      summary: "Update user",
      parameters: parameterGenerator.getPathIdParameter("ID do usuário"),
      // USANDO O GENERATOR AUTOMATICAMENTE
      requestBody: parameterGenerator.getUpdateRequestBody('Users', {
        excludeFields: ['id', 'Despesas', 'Despesas_recorrentes']
      }),
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse"
              }
            }
          }
        }
      }
    }
  }
};

console.log('=== EXEMPLO DE REQUEST BODIES GERADOS ===');
console.log('Create User Body:', JSON.stringify(createUserBody, null, 2));
console.log('Update User Body:', JSON.stringify(updateUserBody, null, 2));
console.log('Multipart User Body:', JSON.stringify(multipartUserBody, null, 2));

console.log('\n=== EXEMPLO DE RESPONSE SCHEMA ===');
console.log('User Response:', JSON.stringify(userResponseSchema, null, 2));

console.log('\n=== TODOS OS SCHEMAS GERADOS ===');
console.log('All Schemas:', JSON.stringify(allUserSchemas, null, 2));

export default {
  createUserBody,
  updateUserBody,
  multipartUserBody,
  userResponseSchema,
  allUserSchemas,
  exampleRoute
};
