import express from "express";
import bodyParser from "body-parser";

import { loginUser, registerUser } from "../controllers/authentication.controllers.js";

const authenticationRouter = express.Router();
const jsonParser = bodyParser.json();

authenticationRouter.post("/register", jsonParser, (req, res) => {
    // TODO: Login request
    registerUser(req, res).then((result) => {
        res.json(result);
    });
});

authenticationRouter.post("/login", jsonParser, (req, res) => {
    loginUser(req, res);
});

export {authenticationRouter};
