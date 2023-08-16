import express from "express";
import bodyParser from "body-parser";

import { addTracking, deleteTracking, readTracking, readTrackingByUserId, updateTracking } from "../controllers/tracking.controllers.js";
import { json } from "sequelize";

const trackingRouter = express.Router();
const jsonParser = bodyParser.json();

trackingRouter.post("/", jsonParser, (req, res) => {
    addTracking(req, res);
});

trackingRouter.get("/:id", jsonParser, (req, res) => {
    if (req.query.type === "objectId"){
        readTracking(req, res);
    }
    else if (req.query.type === "userId"){
        readTrackingByUserId(req, res);
    }
});

trackingRouter.put("/:id", jsonParser, (req, res) => {
    updateTracking(req, res);
});

trackingRouter.delete("/:id", jsonParser, (req, res) => {
    deleteTracking(req, res);
});


export {trackingRouter};
