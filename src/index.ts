require("dotenv").config({path: "../.env"});
import express from "express";

import {connectDB} from "./configs/mongo.db.connect.js"
import {passportSetup} from "./api/middlewares/app.auth.js";
import { bodyParserSetup } from "./api/middlewares/bodyParser.setup.js";

const app = express();

const server = app.listen(3000, () => {
    var dbUrl = process.env.DEVELOPMENT_DB_URL;

    if (process.env.NOVE_ENV === "production"){
        dbUrl = process.env.PRODUCTION_DB_URL;
    }

    connectDB(dbUrl);
    
    passportSetup();

    bodyParserSetup();

    console.log("Server is up and running.");
});

export {app};
