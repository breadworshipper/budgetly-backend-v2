import express from "express";
import bodyParser from "body-parser";

import { createCategory, deleteCategory, readCategory, updateCategory } from "../controllers/category.controllers.js";

const categoryRouter = express.Router();
const jsonParser = bodyParser.json();

categoryRouter.post("/create-category", jsonParser, (req, res) => {
    createCategory(req, res);
});

categoryRouter.get("/read-category", jsonParser, (req, res) => {
    readCategory(req, res);
})

categoryRouter.put("/update-category/:id", jsonParser, (req, res) => {
    updateCategory(req, res);
})

categoryRouter.delete("/delete-category/:id", jsonParser, (req, res) => {
    deleteCategory(req, res);
})
export { categoryRouter };