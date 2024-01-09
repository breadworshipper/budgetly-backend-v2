import { logger } from "../middlewares/winston.logger.js"
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";
import { log } from "console";

async function categoryExistCheck(
    categoryName: string,
    ownerId: string) {
    try {
        const results = await categoryModel.find({
            name: categoryName,
            owner: ownerId
        });
        const result = JSON.stringify(results);
        logger.info(result);
        if (result === "[]" || !result) { 
            return false 
        }
        return true;
    }
    catch (error) {
        logger.info(`An error occured, the error is ${error}`)
    }
}

async function createCategory(req, res) {
         // validate request
        validateToken(req, res, async () => {
        const {categoryName} = req.body;

        const ownerId = req.user.id;

        if (!categoryName || !ownerId) {
            return res.status(400).send({ message: "Content can not be emtpy!" });
        }

        const categoryExistBool = await categoryExistCheck(categoryName, ownerId);
        
        // Check category existence
        if (categoryExistBool) {
            return res.status(500).send({ message: "Category already existed" })
        }

        const category = await categoryModel.create({
            name: categoryName,
            ownerId: ownerId
        });
    
        logger.info(`${categoryName} category for ${ownerId} has been created`)
    
        if (category) {
            return res.status(201).json({ _id: category.id })
        }
     });
}

async function readCategory(req, res) {
    try{
        validateToken(req, res, async () => {
            const id = req.params.id;
            if (id) {
                categoryModel.find({_id: id}).then(data => {
                    logger.info(`Sent all category data`)
                    res.send(data)
                })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "Error Occurred while retriving tracking information" })
                    })
            }
    
            return res.status(400).send("id field must be specified.");
        })
    }
    catch{
        return res.status(500).send("Error reading a category");
    }
    
}

async function readCategoryByUserId(req, res){
    try {
        validateToken(req, res, async () => {
            const ownerId = req.user.id;
    
            if (!ownerId){
                return res.status(400).send("userId field must be specified.");
            }
    
            const category = await categoryModel.find({ownerId: ownerId});
    
            return res.json(category);
        })
    }
    catch(err){
        return res.status(500).send("Error reading user's category");
    }
}

async function updateCategory(req, res) {
    validateToken(req, res, async () => {
        if (!req.body) {
            return res
                .status(400)
                .send({ message: "Data to update can not be empty" })
        }
    
        const id = req.params.id;
        const { newCategoryName } = req.body;
    
        await validateToken(req, res, () => { });
            if(!req.user){ 
                return;
            }
            const ownerId = req.user.id;
    
        categoryModel.findById(id).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Category with id ${id} not found`
                })
            } else {
                if (data.ownerId.toString() !== ownerId){
                    res.status(401).send({
                        message: `Updating user is not the same as category's owner`
                    })
                }
            }
        })
    
        const newCategoryData = {
            name: newCategoryName,
            owner : ownerId
        };
    
        categoryModel.findByIdAndUpdate(id, newCategoryData, { useFindAndModify: false })
            .then(data => {
                if(data)
                    categoryModel.findById(id).then(data => {
                        logger.info(`Updated category with ID ${id}`)
                        res.send(data)
                    })
                }
            )
            .catch(err => {
                res.status(500).send({ message: "Error updating category information " + err })
            })
    })
    
}

async function deleteCategory(req,res) {
    validateToken(req, res, async () => {
        const id = req.params.id;

        categoryModel.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({ message: `Category with id ${id} not found` })
                } else {
                    logger.info(`Deleted category with ID ${id}`)
                    return res.send({
                        message: "Category was deleted successfully!"
                    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                }
            })
            .catch(err => {
                return res.status(500).send({
                    message: `Could not delete category with id= ${id}`
                });
            });
    });
    }

export { createCategory, readCategory, readCategoryByUserId, updateCategory, deleteCategory }