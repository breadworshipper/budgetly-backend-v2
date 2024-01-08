import { userModel } from "../models/user.model.js"
import { logger } from "../middlewares/winston.logger.js"
import { trackingModel } from "../models/tracking.model.js";
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";
import { createCategory } from "./category.controllers.js";
import { budgetModel } from "../models/budget.model.js";


async function addTracking(req, res) {
        validateToken(req, res, async () => { 
            const { name, isExpense, date, categoryName, amount, ownerId } = req.body;
    
            // validate request
            if (!name || !isExpense || !categoryName || !amount || !ownerId) {
                return res.status(400).send({ message: "All fields must be specifed!" });
            }
    
            const categoryQueryCriteria = {
                name: categoryName,
                ownerId: ownerId
            }
            let category = await categoryModel.findOne(categoryQueryCriteria);
    
            if (category === null){
                const category = await categoryModel.create({
                    name: categoryName,
                    owner: ownerId
                });
        
                logger.info(`${categoryName} category for ${ownerId} has been created`)
        
                if (category) {
                    const categoryId = category.id;
                }
    
            } else {
                await budgetModel.updateMany({ownerId: ownerId, categoryId: category._id}, {$inc: {currentSpending: amount}});
            }
    
            let modifiedDate = new Date(date);
            const currentDate = new Date();
    
            modifiedDate.setHours(currentDate.getHours() + 7);
            modifiedDate.setMinutes(currentDate.getMinutes());
            modifiedDate.setMilliseconds(currentDate.getMilliseconds());
    
            const tracking = await trackingModel.create({
                name: name,
                isExpense: isExpense,
                date: modifiedDate,
                category: category._id,
                amount: amount,
                ownerId : ownerId
            });
            logger.info(`A new tracking has been created`)
    
                if (tracking) {
                    return res.status(201).json({ _id: tracking.id })
                }
            }
        );
}

async function readTracking(req, res) {
    if (req.params.id) {
        const id = req.params.id;

        trackingModel.findById(id)
            .then(data => {
                if (!data) {
                    return res.status(500).send({ message: "Not found tracking with id " + id })
                } else {
                    logger.info(`Sent tracking data with ID ${id}`)
                    return res.send(data)
                }
            })
            .catch(err => {
                return res.status(500).send({ message: "Error retrieving tracking with id " + id })
            })

    } else {
        trackingModel.find()
            .then(data => {
                logger.info(`Sent all tracking data`)
                return res.send(data)
            })
            .catch(err => {
                return res.status(500).send({ message: err.message || "Error Occurred while retriving tracking information" })
            })
    }
}

async function readTrackingByUserId(req, res){
        validateToken(req, res, async () => {
            const ownerId = req.params.id;
            const groupBy = req.query.groupBy;
            const sortBy = req.query.sortBy;
    
            if (!ownerId || !groupBy || !sortBy){
                return res.status(400).send("ownerId, groupBy, and sortBy field must be specified.");
            }
    
            const trackings = await trackingModel.find({ownerId: ownerId});
            
            if (groupBy === "time"){
                // Group by time
                const todaysDate = new Date();
                var todaysTrackings = [];
                var yesterdaysTrackings = [];
                var pastsTrackings = [];

                for (let i = 0; i < trackings.length; i++){
                    const currentTracking = trackings[i];
        
                    const currentTrackingsDate = currentTracking.date.getDate(); 
                    const currentTrackingsMonth = currentTracking.date.getMonth();
                    const currentTrackingsYear = currentTracking.date.getFullYear();
        
                    if (currentTrackingsYear === todaysDate.getFullYear() 
                    && currentTrackingsMonth === todaysDate.getMonth() 
                    && currentTrackingsDate === todaysDate.getDate()){
                        todaysTrackings.push(currentTracking);
                    }
                    else if (currentTrackingsYear === todaysDate.getFullYear() 
                    && currentTrackingsMonth === todaysDate.getMonth() 
                    && currentTrackingsDate - todaysDate.getDate() === -1){
                        yesterdaysTrackings.push(currentTracking);
                    }
                    else {
                        pastsTrackings.push(currentTracking);
                    }
                }

                var groupedTrackings = {today: todaysTrackings, yesterday: yesterdaysTrackings, past: pastsTrackings};

                // Sort grouping by time or amount
                // TODO: Fix bug sorting by time and amount
                // TODO: Refactor
                if (sortBy === "time"){    
                    groupedTrackings.today.sort((obj1, obj2) =>
                    obj2.date - obj1.date);
                    groupedTrackings.yesterday.sort((obj1, obj2) =>
                    obj2.date - obj1.date);
                    groupedTrackings.past.sort((obj1, obj2) =>
                    obj2.date - obj1.date);
                }
                else if (sortBy === "amount"){
                    groupedTrackings.today.sort((obj1, obj2) => 
                    obj2.amount - obj1.amount);
                    groupedTrackings.yesterday.sort((obj1, obj2) => 
                    obj2.amount - obj1.amount);
                    groupedTrackings.past.sort((obj1, obj2) => 
                    obj2.amount - obj1.amount);
                }
            }
            else if (groupBy === "category"){
                const result = await trackingModel.aggregate([
                    {
                        $sort: {
                            category: 1,
                            date: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$category",
                            items: { $push: "$$ROOT" }
                        }
                    }
                ]);
        
                const groupedAndSortedData = {};
                
                if (sortBy === "time"){
                    result.forEach(categoryGroup => {
                        const categoryName = categoryGroup._id;
                        const sortedItems = categoryGroup.items.sort((a, b) => a.date - b.date);
                        groupedAndSortedData[categoryName] = sortedItems;
                    });
                }

                else if (sortBy === "amount"){
                    result.forEach(categoryGroup => {
                        const categoryName = categoryGroup._id;
                        const sortedItems = categoryGroup.items.sort((a, b) => a.amount - b.amount);
                        groupedAndSortedData[categoryName] = sortedItems;
                    });
                }


                return res.json(groupedAndSortedData)
            }

            return res.json(groupedTrackings);
        });
}

async function updateTracking(req, res) {
    validateToken(req, res, async () => {
        if (!req.body) {
            return res
                .status(400)
                .send({ message: "Data to update can not be empty" })
        }
        const id = req.params.id;
    
        const { name, isExpense, date, category, amount } = req.body;
    
        await validateToken(req, res, () => { });
        const ownerId = req.user.id;
    
        const trackingData = {
            name: name,
            isExpense: isExpense,
            date: date,            
            category: await categoryModel.findOne({ name: category, ownerId: ownerId }),
            amount: amount
        };
    
        trackingModel.findByIdAndUpdate(id, trackingData, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Update tracking with ID ${id}. Maybe tracking was not found!` })
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
    });
}

async function deleteTracking(req, res) {
    validateToken(req, res, async () => {
        const id = req.params.id;

    trackingModel.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Tracking with id ${id} was not found` })
            } else {
                logger.info(`Deleted tracking with ID ${id}`)
                return res.send({
                    message: "Tracking was deleted successfully!"
                })
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: `Could not delete Tracking with id = ${id}`
            });
        });
    });
}


export { addTracking, readTracking, readTrackingByUserId, updateTracking, deleteTracking}
