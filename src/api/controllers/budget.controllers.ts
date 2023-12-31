import { budgetModel } from "../models/budget.model.js";
import { logger } from "../middlewares/winston.logger.js"
import { validateToken } from "../middlewares/validate.token.handler.js"
import { oneMonthFromNow } from "../helpers/one.month.increment.js";
import { getCurrentDate } from "../helpers/get.current.date.js";


async function addBudget(req, res){
        validateToken(req, res, async () => {
            const {ownerId, categoryId, name, target, startDate, endDate, recurring} = req.body;
    
            if (!ownerId || !categoryId || !name || !target){
                return res.send("ownerId, categoryId, name, and target fields are required.");
            }
    
            const newBudget = await budgetModel.create({
                ownerId: ownerId, 
                categoryId: categoryId,
                name: name,
                target: target,
                startDate: (startDate === null) ? getCurrentDate() : startDate,
                endDate: (endDate === null) ? oneMonthFromNow() : endDate,
                recurring: (recurring === null) ? false : recurring
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
            const currentDate = getCurrentDate()
            
            // Update Recurring budget for the owner
            budgetModel.find({
                ownerId: userId,
                recurring: true,
                endDate: getCurrentDate()
            }).then(budgetList => {
                budgetList.forEach(budget => {
                    budget.updateOne({
                        startDate: currentDate,
                        endDate: currentDate.setDate(currentDate.getDate() + budget.interval)
                    })
                })
            })
    
            const userBudget = await budgetModel.find({ownerId: userId});
    
            return res.status(200).json(userBudget);
        });
}

async function updateBudget(req, res){
        validateToken(req, res, async() => {
        
            if (!req.body) {
                return res.status(400).send("No body was sent.");
            }
    
            const budgetId = req.params.id;
            
            const {name, target, startDate, endDate, recurring} = req.body;
            
            const updateData = {
                name : name ?? undefined,
                target : target ?? undefined,
                startDate: startDate ?? undefined,
                endDate : endDate ?? undefined,
                recurring : recurring ?? undefined
            }

            const updatedBudget = await budgetModel.findByIdAndUpdate(
                {_id : budgetId},
                {$set : updateData},
                {new: true});

            return res.status(200).json(updatedBudget);
        });
}

async function deleteBudget(req, res){
        validateToken(req, res, async () => {
            const budgetId = req.params.id;

            const deletedBudget = await budgetModel.findByIdAndDelete({_id: budgetId});
    
            return res.status(200).json(deletedBudget);
        });
}

export {addBudget, readBudget, readBudgetByUserId, updateBudget, deleteBudget}
