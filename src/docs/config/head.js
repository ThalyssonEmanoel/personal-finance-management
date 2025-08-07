//routes
import userPaths from "../routes/user.js";
import accountPaths from "../routes/account.js";
import authPaths from "../routes/auth.js";
import transactionPaths from "../routes/transaction.js";
import paymentMethodsPaths from "../routes/paymentMethods.js";
import accountPaymentMethodsPaths from "../routes/accountPaymentMethods.js";
import bankTransferPaths from "../routes/bankTransfer.js";

//schemas
import paymentMethodsSchema from "../schemas/paymentMethodsSchema.js";
import accountPaymentMethodsSchema from "../schemas/accountPaymentMethodsSchema.js";
import bankTransferSchema from "../schemas/bankTransferSchema.js";

//request schemas
import AccountRequest from "../schemas/requestMold/AccountRequest.js";
import AuthRequest from "../schemas/requestMold/AuthRequest.js";
import UserRequest from "../schemas/requestMold/UserRequest.js";
import TransactionRequest from "../schemas/requestMold/TransactionRequest.js";

//response schemas
import AccountResponse from "../schemas/responseMold/AccountResponse.js";
import AuthResponse from "../schemas/responseMold/AuthResponse.js";
import UserResponse from "../schemas/responseMold/UserResponse.js";
import TransactionResponse from "../schemas/responseMold/TransactionResponse.js";

// Function to define the server URLs depending on the environment
const getServersInCorrectOrder = () => {
  const devUrl = { url: process.env.SWAGGER_DEV_URL || "http://localhost:8080" };
  const prodUrl = { url: process.env.SWAGGER_PROD_URL || "https://blábláblá.app.fslab.dev" };

  if (process.env.NODE_ENV === "production") return [prodUrl];
  else return [devUrl];
};

// Function to obtain Swagger options
const getSwaggerOptions = () => {
  return {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Financial Record Back End",
        version: "1.0-alpha",
        description: "This is the backend for Financial Record, the capstone project of student Thalysson Emanoel. <br>Authentication is required, and a JWT token must be provided in the Authorization header.",
      },
      servers: getServersInCorrectOrder(),
      tags: [
        {
          name: "Auth",
          description: "Authentication route."
        },
        {
          name: "Users",
          description: "User management route."
        },
        {
          name: "Accounts",
          description: "Account management route."
        },
        {
          name: "Transactions",
          description: "Transaction management route."
        },
        {
          name: "Payment Methods",
          description: "Payment methods management route."
        },
        {
          name: "Account Payment Methods",
          description: "Account payment methods relationship management route."
        },
        {
          name: "Bank Transfers",
          description: "Bank transfer management route for transferring money between user accounts."
        }
      ],
      paths: {
        ...authPaths,
        ...accountPaths,
        ...userPaths,
        ...transactionPaths,
        ...paymentMethodsPaths,
        ...accountPaymentMethodsPaths,
        ...bankTransferPaths,
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        },
        schemas: {
          ...paymentMethodsSchema,
          ...accountPaymentMethodsSchema,
          ...bankTransferSchema,
          requestMold: {
            ...AuthRequest,
            ...UserRequest,
            ...AccountRequest,
            ...TransactionRequest
          },
          responseMold: {
            ...AuthResponse,
            ...UserResponse,
            ...AccountResponse,
            ...TransactionResponse
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: ["./src/routes/*.js"]
  };
};

export default getSwaggerOptions;
