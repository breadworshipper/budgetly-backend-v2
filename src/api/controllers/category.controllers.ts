import { logger } from "../middlewares/winston.logger.js"
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";
import { log } from "console";

async function categoryExistCheck(
    categoryName: String,
    ownerId: any) {
    try {
        const results = await categoryModel.find({
            name: categoryName,
            owner: ownerId
        });
        const result = JSON.stringify(results);
        if (result === "[]" || !result) { return false }
        return true;
    }
    catch (error) {
        logger.info(`An error occured, the error is ${error}`)
    }
}

async function createCategory(req, res) {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const categoryName = req.body.categoryName;

   await validateToken(req, res, () => { });
        if(!req.user){ 
            return;
        }
        const ownerId = req.user.id;

    const categoryExistBool = await categoryExistCheck(categoryName, ownerId);

    if (categoryExistBool) {
        res.status(500).send({ message: "Category already existed" })
    }
    else {
        const category = await categoryModel.create({
            name: categoryName,
            owner: ownerId
        });

        logger.info(`${categoryName} category for ${ownerId} has been created`)

        if (category) {
            return res.status(201).json({ _id: category.id })
        }
    }

}

async function readCategory(req, res) {
    if (req.body.id) {
        //TODO for finding specific category
    }
    else {
        categoryModel.find().then(data => {
            logger.info(`Sent all category data`)
            res.send(data)
        })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving tracking information" })
            })
    }

}

async function updateCategory(req, res) {
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
            if (data.owner.toString() !== ownerId){
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
}

async function deleteCategory(req,res) {
    const id = req.params.id;

        categoryModel.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Category with id ${id} not found` })
                } else {
                    res.send({
                        message: "Category was deleted successfully!"
                    })
                    logger.info(`Deleted category with ID ${id}`)
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: `Could not delete category with id= ${id}`
                });
            });
    }

export { createCategory, readCategory, updateCategory, deleteCategory }