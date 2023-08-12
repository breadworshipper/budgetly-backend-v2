import express from "express";
import bodyParser from "body-parser";
import { countTracking } from "../controllers/stats.controller.js";

const statsRouter = express.Router();
const jsonParser = bodyParser.json();

statsRouter.get("/", jsonParser, (req, res) => {
    countTracking(req, res);
})

export {statsRouter};
