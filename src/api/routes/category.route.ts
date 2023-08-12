import express from "express";
import bodyParser from "body-parser";

import { createCategory, deleteCategory, readCategory, readCategoryByUserId, updateCategory } from "../controllers/category.controllers.js";

const categoryRouter = express.Router();
const jsonParser = bodyParser.json();

categoryRouter.post("/", jsonParser, (req, res) => {
    createCategory(req, res);
});

categoryRouter.get("/:id", jsonParser, (req, res) => {
    if (req.query.type === "objectId"){
        readCategory(req, res);
    }
    else if (req.query.type === "userId"){
        readCategoryByUserId(req, res);
    }
})

categoryRouter.put("/:id", jsonParser, (req, res) => {
    updateCategory(req, res);
})

categoryRouter.delete("/:id", jsonParser, (req, res) => {
    deleteCategory(req, res);
})
export { categoryRouter };