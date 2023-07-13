import swaggerUi from "swagger-ui-express";
import { app } from "../../index.js";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition : {
        openapi: '3.0.0',
        info: {
            title: "budgetly REST API"
        }
    },
    apis: ["../routes/*.js"]
};

const openapiSpecification = swaggerJsdoc(options);

async function swaggerSetup(){
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
}

export {swaggerSetup};
