import express from "express";
import bodyParser from "body-parser";

import { addTracking, countTracking, deleteTracking, readTracking, readTrackingByUserId, updateTracking } from "../controllers/tracking.controllers.js";
import { json } from "sequelize";

const trackingRouter = express.Router();
const jsonParser = bodyParser.json();

trackingRouter.post("/create-tracking", jsonParser, (req, res) => {
    addTracking(req, res);
});

trackingRouter.get("/read-tracking", jsonParser, (req, res) => {
    readTracking(req, res);
});

trackingRouter.get("/read-tracking-user/:id", jsonParser, (req, res) => {
    readTrackingByUserId(req, res);
})

trackingRouter.put("/update-tracking/:id", jsonParser, (req, res) => {
    updateTracking(req, res);
});

trackingRouter.delete("/delete-tracking/:id", jsonParser, (req, res) => {
    deleteTracking(req, res);
});

trackingRouter.get("/count-tracking", jsonParser, (req, res) => {
    countTracking(req, res);
});

export {trackingRouter};
