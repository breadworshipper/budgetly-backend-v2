import { userModel } from "../models/user.model.js"
import { logger } from "../middlewares/winston.logger.js"
import { currentUser } from "./authentication.controllers.js";
import { trackingmodel } from "../models/tracking.model.js";
import { categoryModel } from "../models/category.model.js";


async function addTracking(req, res){
    // TODO
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    const {name, isExpense, date, category, amount} = req.body;

    const user = currentUser;

    const tracking = await trackingmodel.create({
        name : name,
        isExpense : isExpense,
        date : date,
        category : await categoryModel.findOne({category}),
        amount : amount
    });
    
    logger.info(`A new tracking has been created`)

    if(tracking){
        return res.status(201).json({_id: tracking.id})
    }
}

async function readTracking(req, res){
    if(req.body.id){
        const id = req.body.id;

        trackingmodel.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found tracking with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving tracking with id " + id})
            })

    }else{
        trackingmodel.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving tracking information" })
            })
    }
}

async function updateTracking(req, res){
    // TODO
    // logger.info(...)

    // return tracking
}

async function deleteTracking(req, res){
    // TODO
    // logger.info(...)
}

// ... Klo ada yang kurang tambahkan

export {addTracking, readTracking, updateTracking, deleteTracking}
