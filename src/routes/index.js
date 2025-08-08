import express from "express";
import users from "./UserRoute.js";
import auth from "./AuthRoutes.js";
import account from "./AccountRoutes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import getSwaggerOptions from "../docs/config/head.js";
import Transaction from "./TransactionRoutes.js";
import PaymentMethods from "./PaymentMethodsRoutes.js";
import BankTransfer from "./BankTransferRoutes.js";

const routes = (app) => {
    // Configurando a documentação da Swagger UI para ser servida diretamente em '/'
    const swaggerDocs = swaggerJsDoc(getSwaggerOptions());
    app.use(swaggerUI.serve);
    app.get("/", (req, res, next) => {
        swaggerUI.setup(swaggerDocs)(req, res, next);
    });

    app.use(
        express.json(),
        // rotas
        auth,
        users,
        account,
        Transaction,
        PaymentMethods,
        BankTransfer
    );

    // Se não é nenhuma rota válida, produz 404
    app.use((req, res, next) => {
        res.status(404).json({ message: "Rota não encontrada" });
    });
};

export default routes;