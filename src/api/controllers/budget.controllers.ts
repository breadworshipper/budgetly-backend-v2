import { budgetModel } from "../models/budget.model.js";
import { logger } from "../middlewares/winston.logger.js"
import { validateToken } from "../middlewares/validate.token.handler.js"


async function addBudget(req, res){
    validateToken(req, res, () => {
    });

    // TODO : startDate, endDate
    const {ownerId, name} = req.body;

    if (!ownerId || !name){
        res.send("ownerId and name fields are required.");
    }

    const newBudget = await budgetModel.create({
        ownerId: ownerId, 
        name: name
    });

    logger.info(`${ownerId} has added a ${name} budget.`);

    return res.json({newBudgetId: newBudget.id});
}

async function readBudget(req, res){
    validateToken(req, res, () => {
    });

    const budgetId = req.params.id;

    const budget = await budgetModel.findById(budgetId);

    console.log(budget);

    if (!budget){
        return res.status(400).send(`Budget with id ${budgetId} does not exist.`);
    }

    return res.status(200).send(budget);
}

async function readBudgetByUserId(req, res){
    validateToken(req, res, () => {
    });
    
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

export {addBudget, readBudget, updateBudget, deleteBudget}
