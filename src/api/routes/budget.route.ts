import express from "express";
import bodyParser from "body-parser";

import { addBudget, deleteBudget, readBudget, readBudgetByUserId, updateBudget } from "../controllers/budget.controllers.js";

const budgetRouter = express.Router();
const jsonParser = bodyParser.json();

budgetRouter.post("/", jsonParser, (req, res) => {
    addBudget(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error adding a budget."));
});

budgetRouter.get("/", jsonParser, (req, res) => {
    readBudgetByUserId(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error getting user's budget."));
});

budgetRouter.put("/:id", jsonParser, (req, res) => {
    updateBudget(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error updating a budget."));
});

budgetRouter.delete("/:id", jsonParser, (req, res) => {
    deleteBudget(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error deleting a budget."));
});

export {budgetRouter};
