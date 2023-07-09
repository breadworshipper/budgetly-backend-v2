import express from "express";
import "dotenv/config";

import {connectDB} from "./configs/mongo.db.connect.js"
import {passportSetup} from "./api/middlewares/app.auth.js";
import { bodyParserSetup } from "./api/middlewares/bodyParser.setup.js";
import { authenticationRouter } from "./api/routes/auth.route.js";

const app = express();

var dbUrl = process.env.DEVELOPMENT_DB_URL;

if (process.env.NOVE_ENV === "production"){
    dbUrl = process.env.PRODUCTION_DB_URL;
}

connectDB(dbUrl);

passportSetup();

bodyParserSetup();

app.use("/api/v1/auth", authenticationRouter);

const server = app.listen(3000, () => {
    console.log("Server is up and running.");
});

export {app};
