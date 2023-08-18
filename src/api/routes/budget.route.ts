import express from "express";
import bodyParser from "body-parser";

import { addBudget, deleteBudget, readBudget, readBudgetByUserId, updateBudget } from "../controllers/budget.controllers.js";

const budgetRouter = express.Router();
const jsonParser = bodyParser.json();

budgetRouter.post("/", jsonParser, (req, res) => {
    addBudget(req, res);
});

budgetRouter.get("/:id", jsonParser, (req, res) => {
    if (req.query.type === "objectId"){
        readBudget(req, res);
    }
    else (req.query.type === "userId"){
        readBudgetByUserId(req, res);
    }
});

budgetRouter.put("/:id", jsonParser, (req, res) => {
    updateBudget(req, res);
});

budgetRouter.delete("/:id", jsonParser, (req, res) => {
    deleteBudget(req, res);
});

export {budgetRouter};
