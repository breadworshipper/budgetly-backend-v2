import express from "express";
import bodyParser from "body-parser";

import { addBudget, readBudget } from "../controllers/budget.controllers.js";
import { validateToken } from "../middlewares/validate.token.handler.js";

const budgetRouter = express.Router();
const jsonParser = bodyParser.json();

budgetRouter.post("/", jsonParser, (req, res) => {
    addBudget(req, res);
});

budgetRouter.get("/", jsonParser, (req, res) => {

});

export {budgetRouter};
