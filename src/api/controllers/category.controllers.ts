import { logger } from "../middlewares/winston.logger.js"
import { categoryModel } from "../models/category.model.js";
import { validateToken } from "../middlewares/validate.token.handler.js";

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
        const {categoryName, ownerId} = req.body;

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
    validateToken(req, res, async () => {
        const {id} = req.body;
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

async function readCategoryByUserId(req, res){
    validateToken(req, res, async () => {
        const ownerId = req.params.id;

        if (!ownerId){
            return res.status(400).send("userId field must be specified.");
        }

        const category = await categoryModel.find({ownerId: ownerId});

        return res.json(category);
    })
}

async function updateCategory(req, res) {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }
    const id = req.params.id;

    const { name } = req.body;

    await validateToken(req, res, ()=>{});
    const ownerId = req.user.id;

    const categoryData = {
        name: name,
        owner : ownerId
    };

    categoryModel.findByIdAndUpdate(id, categoryData, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update category with ID ${id}. Maybe category not found!` })
            } else {
                categoryModel.findById(id).then(data => {
                    logger.info(`Updated category with ID ${id}`)
                    res.send(data)
                })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update category information " + err })
        })
}

async function deleteCategory(req,res) {
    
}

export { createCategory, readCategory, readCategoryByUserId, updateCategory, deleteCategory }