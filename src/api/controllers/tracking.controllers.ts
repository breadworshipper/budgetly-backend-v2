import { userModel } from "../models/user.model.js"
import { logger } from "../middlewares/winston.logger.js"
import { currentUser } from "./authentication.controllers.js";
import { trackingModel } from "../models/tracking.model.js";
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";


async function addTracking(req, res) {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const { name, isExpense, date, category, amount } = req.body;

    await validateToken(req, res, ()=>{});
    const ownerId = req.user.id;

    const tracking = await trackingModel.create({
        name: name,
        isExpense: isExpense,
        date: date,
        category: await categoryModel.findOne({ category, ownerId }),
        amount: amount
    });

    logger.info(`A new tracking has been created`)

    if (tracking) {
        return res.status(201).json({ _id: tracking.id })
    }
}

async function readTracking(req, res) {
    if (req.body.id) {
        const id = req.body.id;

        trackingModel.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found tracking with id " + id })
                } else {
                    logger.info(`Sent tracking data with ID ${id}`)
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Erro retrieving tracking with id " + id })
            })

    } else {
        trackingModel.find()
            .then(data => {
                logger.info(`Sent all tracking data`)
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving tracking information" })
            })
    }
}

async function updateTracking(req, res) {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }
    const id = req.params.id;

    const { name, isExpense, date, category, amount } = req.body;

    await validateToken(req, res, ()=>{});
    const ownerId = req.user.id;

    const trackingData = {
        name: name,
        isExpense: isExpense,
        date: date,
        category: await categoryModel.findOne({ category, ownerId }),
        amount: amount
    };

    trackingModel.findByIdAndUpdate(id, trackingData, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update tracking with ID ${id}. Maybe tracking not found!` })
            } else {
                trackingModel.findById(id).then(data => {
                    logger.info(`Updated tracking with ID ${id}`)
                    res.send(data)
                })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update tracking information " + err })
        })
}

async function deleteTracking(req, res) {
    const id = req.params.id;

    trackingModel.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "Tracking was deleted successfully!"
                })
                logger.info(`Deleted tracking with ID ${id}`)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete Tracking with id= ${id}`
            });
        });
}

// ... Klo ada yang kurang tambahkan

export { addTracking, readTracking, updateTracking, deleteTracking }
