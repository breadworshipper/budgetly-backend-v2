import express from "express";
import bodyParser from "body-parser";

import { addBudget, readBudget } from "../controllers/budget.controllers.js";

const budgetRouter = express.Router();
const jsonParser = bodyParser.json();

budgetRouter.post("/", jsonParser, (req, res) => {
    addBudget(req, res).then(
        (result) => {
            res.json(result);
        }
    );
});

budgetRouter.get("/", jsonParser, (req, res) => {
    readBudget(req, res).then(
        (result) => {
            res.json(result);
        }
    )
});

export {budgetRouter};
