import express from "express";
import bodyParser from "body-parser";

import { addTracking, readTracking } from "../controllers/tracking.controllers.js";

const trackingRouter = express.Router();
const jsonParser = bodyParser.json();

trackingRouter.post("/create-tracking", jsonParser, (req, res) => {
    addTracking(req, res);
});

trackingRouter.get("/read-tracking", jsonParser, (req, res) => {
    readTracking(req, res);
});

// TODO : PUT route

// TODO : DELETE route

export {trackingRouter};
