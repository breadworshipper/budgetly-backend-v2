import express from "express";
import bodyParser from "body-parser";

import { addTracking, readTracking } from "../controllers/tracking.controllers.js";

const trackingRouter = express.Router();
const jsonParser = bodyParser.json();

trackingRouter.post("/", jsonParser, (req, res) => {
    addTracking(req, res).then(
        (result) => {
            res.json(result);
        }
    );
});

trackingRouter.get("/", jsonParser, (req, res) => {
    readTracking(req, res).then(
        (result) => {
            res.json(result);
        }
    );
});

// TODO : PUT route

// TODO : DELETE route

export {trackingRouter};
