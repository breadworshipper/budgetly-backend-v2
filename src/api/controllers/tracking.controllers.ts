import { userModel } from "../models/user.model.js"
import { logger } from "../middlewares/winston.logger.js"
import { trackingModel } from "../models/tracking.model.js";
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";
import { createCategory } from "./category.controllers.js";


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
        let category;
        
        category = await categoryModel.findOne(categoryQueryCriteria);

        console.log(category);

        if (category === null){
            const category = await categoryModel.create({
                name: categoryName,
                owner: ownerId
            });
    
            logger.info(`${categoryName} category for ${ownerId} has been created`)
    
            if (category) {
                const categoryId = category.id;
            }

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
                res.status(500).send({ message: "Error retrieving tracking with id " + id })
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

async function readTrackingByUserId(req, res){
    validateToken(req, res, async () => {
        const ownerId = req.params.id

        if (!ownerId){
            return res.status(400).send("ownerId field must be specified.");
        }

        const trackings = await trackingModel.find({ownerId: ownerId});

        let sortedTrackings = trackings.sort((obj1, obj2) =>
            obj2.date - obj1.date
        );

        const todaysDate = new Date();
        let todaysTrackings = [];
        let yesterdaysTrackings = [];
        let pastsTrackings = [];

        // TODO: Refactor 
        for (let i = 0; i < sortedTrackings.length; i++){
            const currentTracking = sortedTrackings[i];

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

        return res.status(200).json({today: todaysTrackings, yesterday: yesterdaysTrackings, past: pastsTrackings});
    });
}

async function updateTracking(req, res) {
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
                res.status(404).send({ message: `Tracking with id ${id} not found` })
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

async function countTracking(req, res) {
        try{
            const nonNullTrackingCount = await trackingModel.countDocuments({ category: { $ne: null } });
        const categories = await categoryModel.find()
        const trackingCountPromises = categories.map(async (categoryObject) => {
            const categoryTotal = await trackingModel.countDocuments({ category: categoryObject.id });
            const categoryInfo = {
              categoryName: categoryObject.name,
              categoryTotal: categoryTotal,
              categoryPercentage: (categoryTotal / nonNullTrackingCount) * 100,
            };
            return categoryInfo;
          });
      
          const trackingCountList = await Promise.all(trackingCountPromises);
          
          logger.info(trackingCountList);
      
          res.send(trackingCountList);
        } catch(err) {
            logger.info(`An error occured, ` + err)
            res.status(500).send(`An error occured, ` + err)
        }
    }
export { addTracking, readTracking, readTrackingByUserId, updateTracking, deleteTracking, countTracking}
