import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../middlewares/winston.logger.js";
import { validateToken } from "../middlewares/validate.token.handler.js";
import { categoryModel } from "../models/category.model.js";

async function registerUser(req, res){
        const {username, password} = req.body;

        if (!username || !password){
            return res.status(400).send("All fields are required.");
        }

        const userAvailable = await userModel.findOne({username});

        if (userAvailable){
            return res.status(400).send("User is already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            username: username,
            password: hashedPassword
        });

        if(user){
            const categoryPreset = ["Food", "Entertainment", "Transport", "Household", "Apparel", "Health", "Education", "Social Life", "Pets", "Gift"];
            for (let i = 0; i < categoryPreset.length; i++){
                let categoryName = categoryPreset[i]

                await categoryModel.create({
                    name: categoryName,
                    ownerId: user.id
                });
        
                logger.info(`${categoryName} category for ${user.id} has been created`)
            }
            logger.info(`${username} has been registered`);
            return res.status(201).json({_id: user.id});
        }
        
        return res.status(400).send("User data is not valid.");
}

async function loginUser(req, res){
        const {username, password} = req.body;

        if (!username || !password){
            return res.status(400).send("All fields are required.");
        }
        
        const user = await userModel.findOne({username});
    
        if (user && (await bcrypt.compare(password, user.password))){
            const accessToken = jwt.sign({
                user: {
                    id: user.id,
                    username: user.username
                }
            }, 
            process.env.SECRET,
            {expiresIn: "30m"});
            
            logger.info(`${username} has logged in.`);
    
            return res.status(200).json({accessToken});
        }
    
        return res.status(401).send("Log in failed (email or password is not valid).");
}

async function currentUser(req, res){
    validateToken(req, res, () =>{
        res.json(req.user);
    });
}

export {registerUser, loginUser, currentUser};
