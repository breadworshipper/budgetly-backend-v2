import passport from "passport";
import session from "express-session";
import {app} from "../../index.js";
import connectMongo from "connect-mongo";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { Strategy as LocalStrategy } from 'passport-local';

import {userModel} from "../models/user.model.js";

async function passportSetup(){
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: new connectMongo({mongoUrl: process.env.DEVELOPMENT_DB_URL}),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 30 // 30 Days before expiry
        }  
      }));   
    app.use(passport.initialize());
    app.use(passport.session());

    const strategy = new LocalStrategy(userModel.authenticate());
    
    passport.use(strategy);
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    console.log("Passport done setting-up");
}

export {passportSetup};
