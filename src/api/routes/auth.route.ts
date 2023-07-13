import express from "express";
import bodyParser from "body-parser";

import { loginUser, registerUser } from "../controllers/authentication.controllers.js";
import { userModel } from "../models/user.model.js";

const authenticationRouter = express.Router();
const jsonParser = bodyParser.json();

authenticationRouter.post("/register", jsonParser, (req, res) => {
    registerUser(req, res);
});

authenticationRouter.post("/login", jsonParser, (req, res) => {
    loginUser(req, res);
});

export {authenticationRouter};
