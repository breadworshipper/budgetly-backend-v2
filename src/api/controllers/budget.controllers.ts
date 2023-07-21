import { userModel } from "../models/user.model.js"
import { logger } from "../middlewares/winston.logger.js"
import { validateToken } from "../middlewares/validate.token.handler.js"


async function addBudget(req, res){
    // TODO
    //logger.info(...)

    // return budget
    validateToken(req, res, () => {
        return res.json(req.user);
    });
}

async function readBudget(req, res){
    // TODO
    // logger.info(...)

    // return budget
}

async function updateBudget(req, res){
    // TODO
    // logger.info(...)

    // return budget
}

async function deleteBudget(req, res){
    // TODO
    // logger.info(...)
}

// ... Klo ada yang kurang tambahkan

export {addBudget, readBudget, updateBudget, deleteBudget}
