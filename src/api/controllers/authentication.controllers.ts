import { userModel } from "../models/user.model.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { logger } from "../middlewares/winston.logger.js";

async function registerUser(req, res){
    console.log("Masuk service.")
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
        username: email,
        password: hashedPassword
    });

    await newUser.save();

    logger.info(`Email : ${email} has been registered`);

    return newUser;
}

async function loginUser(req, res){
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({ username: email });
    
        if (!user) {
          return res.status(401).send("User not found");
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (passwordMatch) {
          req.login(user, function (err) {
            if (err) {
              console.log(err);
              return res.status(500).send("Login failed");
            }
            console.log("Login success");
            res.json(user);
          });
        } else {
          return res.status(401).send("Invalid password");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send("Login failed");
      }
}

export {registerUser, loginUser};
