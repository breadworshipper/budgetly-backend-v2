import { userModel } from "../models/user.model.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { logger } from "../middlewares/winston.logger.js";

async function registerUser(req, res){
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
        username: email,
        password: hashedPassword
    });

    await newUser.save();

    logger.info(`Email : ${email} has been registered`);

    return res.json(newUser);
}

async function loginUser(req, res){
  const {email, password} = req.body;

  const user = await userModel.findOne({username: email});

  if (!user){
    return res.status(401).send("User does not exist.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch){
    req.login(user, (err) => {
      if (err){
        return res.status(500).send("Login failed.");
      }

      logger.info(`${user.username} just logged in.`);
    });

    return res.json(user);
  }

  return res.status(401).send("Invalid password.");
}

export {registerUser, loginUser};
