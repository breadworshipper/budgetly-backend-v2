import { budgetModel } from "../models/budget.model.js";
import { logger } from "../middlewares/winston.logger.js"
import { validateToken } from "../middlewares/validate.token.handler.js"


async function addBudget(req, res){
    validateToken(req, res, async () => {
        // TODO : startDate, endDate
        const {ownerId, name, target} = req.body;

        if (!ownerId || !name || !target){
            return res.send("ownerId, name, and target fields are required.");
        }

        const newBudget = await budgetModel.create({
            ownerId: ownerId, 
            name: name,
            target: target
        });

        logger.info(`${ownerId} has added a ${name} budget.`);

        return res.json({newBudgetId: newBudget.id});
    });
}

async function readBudget(req, res){
    validateToken(req, res, async () => {
        const budgetId = req.params.id;

        const budget = await budgetModel.findById(budgetId);
    
        if (!budget){
            return res.status(400).send(`Budget with id ${budgetId} does not exist.`);
        }
    
        return res.status(200).send(budget);
    });
}

async function readBudgetByUserId(req, res){
    validateToken(req, res, async () => {
        const userId = req.params.id;

        const userBudget = await budgetModel.find({ownerId: userId});

        return res.status(200).json(userBudget);
    });
    
}

async function updateBudget(req, res){
    validateToken(req, res, async() => {
        try{
            if (!req.body) {
                return res.status(400).send("No body was sent.");
            }
    
            const budgetId = req.params.id;
            
            // TODO : rest of the budget attributes
            const {name, target} = req.body;
    
            const updatedBudget = await budgetModel.findByIdAndUpdate(
                {_id : budgetId},
                {name: name, target: target},
                {new: true});

            return res.status(200).json(updatedBudget);
        }
        catch {
            return res.status(500).send("Error updating budget.");
        }
    });
}

async function deleteBudget(req, res){
    try {
        validateToken(req, res, async () => {
            const budgetId = req.params.id;

            const deletedBudget = await budgetModel.findByIdAndDelete({_id: budgetId});
    
            return res.status(200).json(deletedBudget);
        });
    }
    catch {
        return res.status(500).send("Error deleting budget.");
    }
}

export {addBudget, readBudget, readBudgetByUserId, updateBudget, deleteBudget}
