import express from "express";
import bodyParser from "body-parser";

const pingRouter = express.Router();
const jsonParser = bodyParser.json();

pingRouter.post("/", jsonParser, (req, res) => {
    res.send("Server is online.");
});

export {pingRouter}
