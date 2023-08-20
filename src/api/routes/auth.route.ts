import express from "express";
import bodyParser from "body-parser";

import { registerUser, loginUser, currentUser } from "../controllers/authentication.controllers.js";

const authenticationRouter = express.Router();
const jsonParser = bodyParser.json();

authenticationRouter.post("/register", jsonParser, (req, res) => {
    registerUser(req, res)
        .catch(console.error)
        .then(() => res.status(500).send("Error registering a user.")); 
});

authenticationRouter.post("/login", jsonParser, (req, res) => {
    loginUser(req, res)
        .catch(console.error)
        .then(() => res.status(500).send("Error logging in a user."));
});

authenticationRouter.post("/current", (req, res) => {
    currentUser(req, res);
});

export {authenticationRouter};
