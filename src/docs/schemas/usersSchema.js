// // schemas/estudantesSchemas.js
// import mongoose from 'mongoose';
// import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
// import removeFieldsRecursively from '../../utils/removeFields.js';
// import Estudante from '../../models/Estudante.js';


// // Importa as funções utilitárias separadas
// import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// // Registra o plugin para que o Mongoose ganhe o método jsonSchema()
// /**
//  * @mongooseSchemaJsonSchema eLE GERA O JSON SCHEMA A PARTIR DO SCHEMA DO MONGOOSE, O QUE É MUITO ÚTIL PARA VALIDAR OS DADOS ENVIADOS NA REQUISIÇÃO.
//  * O JSON SCHEMA É UM FORMATO PADRÃO PARA DESCREVER E VALIDAR ESTRUTURAS DE DADOS EM JSON.
//  * EXEMPLO:
//  * {
//  *  "type": "object",
//  *  "properties": {
//  *    "name": { "type": "string" },
//  *    "age": { "type": "number", "minimum": 0 }
//  *   },
//  *   "required": ["name"]
//  * }
//  */
// mongooseSchemaJsonSchema(mongoose);

// // Gera o JSON Schema a partir dos schemas dos modelos
// const estudanteJsonSchema = Estudante.schema.jsonSchema();

// // Remove campos que não queremos na base original
// delete estudanteJsonSchema.properties.__v;

// // Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
// const estudantesSchemas = {
//     EstudanteFiltro: {
//     title: "EstudanteFiltro", 
//     type: "object",
//     properties: {
//       _id: { type: "string" },
//       matricula: { type: "string" },
//       nome: { type: "string" },
//       ativo: { type: "boolean" },
//       turma: { type: "string" },
//       curso: { type: "string" },
//       pagina: { type: "string" },
//     },
//   },
//   EstudanteListagemPaginada: {
//     title: "EstudanteListagemPaginada",
//     type: "object",
//     properties: {
//       data: {
//         type: "array",
//         items: { $ref: "#/components/schemas/EstudanteListagem" }
//       },
//       total: { type: "integer", example: 100 },
//       limit: { type: "integer", example: 10 },
//       totalPages: { type: "integer", example: 10 },
//       page: { type: "integer", example: 1 }
//     },
//     description: "Schema para listagem paginada de estudantes"
//   },
//   EstudanteListagem: {
//     ...deepCopy(estudanteJsonSchema),
//     description: "Schema para listagem de usuários"
//   },
//   EstudanteDetalhes: {
//     ...deepCopy(estudanteJsonSchema),
//     description: "Schema para detalhes de um usuário"
//   },
//   EstudantePost: {
//     ...deepCopy(estudanteJsonSchema),
//     description: "Schema para criação de usuário"
//   },
//   EstudantePutPatch: {
//     ...deepCopy(estudanteJsonSchema),
//     required: [],
//     description: "Schema para atualização de usuário"
//   }
// };

// // Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
// const removalMapping = {
//   EstudanteListagem: ['__v'],
//   EstudanteDetalhes: ['__v'],
//   EstudantePost: ['createdAt', 'updatedAt', '__v', '_id'],
//   EstudantePutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
// };

// // Aplica a remoção de campos de forma individual a cada schema
// Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
//   if (estudantesSchemas[schemaKey]) {
//     removeFieldsRecursively(estudantesSchemas[schemaKey], fields);
//   }
// });

// // Utiliza o schema do Mongoose para detectar referências automaticamente
// const estudanteMongooseSchema = Estudante.schema;

// // Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
// estudantesSchemas.EstudanteListagem.example = await generateExample(estudantesSchemas.EstudanteListagem, null, estudanteMongooseSchema);
// estudantesSchemas.EstudanteDetalhes.example = await generateExample(estudantesSchemas.EstudanteDetalhes, null, estudanteMongooseSchema);
// estudantesSchemas.EstudantePost.example = await generateExample(estudantesSchemas.EstudantePost, null, estudanteMongooseSchema);
// estudantesSchemas.EstudantePutPatch.example = await generateExample(estudantesSchemas.EstudantePutPatch, null, estudanteMongooseSchema);

// export default estudantesSchemas;
