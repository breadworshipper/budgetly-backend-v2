import passport from "passport";
import session from "express-session";
import {app} from "../../index.js";

import {userModel} from "../models/user.model.js";

async function passportSetup(){
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false  
      }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(userModel.createStrategy());
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());
}

export {passportSetup};
