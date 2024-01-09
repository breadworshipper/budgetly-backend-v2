import express from "express";
import bodyParser from "body-parser";

import { addTracking, deleteTracking, readTracking, readTrackingByUserId, updateTracking } from "../controllers/tracking.controllers.js";

const trackingRouter = express.Router();
const jsonParser = bodyParser.json();

trackingRouter.post("/", jsonParser, (req, res) => {
    addTracking(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error adding a tracking."));
});

trackingRouter.get("/", jsonParser, (req, res) => {
    readTrackingByUserId(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error getting user's tracking."));
    
});

trackingRouter.put("/:id", jsonParser, (req, res) => {
    updateTracking(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error updating a tracking."));
});

trackingRouter.delete("/:id", jsonParser, (req, res) => {
    deleteTracking(req, res)
        // .catch(console.error)
        // .then(() => res.status(500).send("Error deleting a tracking."));
});


export {trackingRouter};
