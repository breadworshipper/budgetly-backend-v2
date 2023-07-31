import express from "express";
import bodyParser from "body-parser";

import { addBudget, readBudget, readBudgetByUserId, updateBudget } from "../controllers/budget.controllers.js";

const budgetRouter = express.Router();
const jsonParser = bodyParser.json();

budgetRouter.post("/", jsonParser, (req, res) => {
    addBudget(req, res);
});

budgetRouter.get("/:id", jsonParser, (req, res) => {
    readBudget(req, res);
});

budgetRouter.get("/user/:id", jsonParser, (req, res) => {
    readBudgetByUserId(req, res);
});

budgetRouter.put("/:id", jsonParser, (req, res) => {
    updateBudget(req, res);
})

export {budgetRouter};
