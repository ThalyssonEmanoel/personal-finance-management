import HttpStatusCodes from "../../utils/HttpStatusCodes.js";
import CommonResponse from "../../utils/commonResponse.js";

const swaggerCommonResponses = {};

// Percorre todas as chaves do HttpStatusCodes e cria dinamicamente
// um método para cada status code, no mesmo padrão que você já utiliza.
Object.keys(HttpStatusCodes).forEach((statusKey) => {
  const { code, message } = HttpStatusCodes[statusKey];

  swaggerCommonResponses[code] = (schemaRef = null, description = message) => {
    // Usa o CommonResponse para gerar a estrutura base
    const response = new CommonResponse(
      code >= 400,
      code,
      description,
      schemaRef ? { $ref: schemaRef } : [] // Usa o schemaRef ou array vazio para saber se é um array
    );

    return {
      description: response.message,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "boolean", example: response.error },
              code: { type: "integer", example: response.code },
              message: { type: "string", example: response.message },
              data: schemaRef
                ? { $ref: schemaRef }
                : { type: "array", items: {}, example: [] },
            },
          },
        },
      },
    };
  };
});

export default swaggerCommonResponses;
