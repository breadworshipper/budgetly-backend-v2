import express from "express";
import "dotenv/config";

import {connectDB} from "./configs/mongo.db.connect.js"
import { bodyParserSetup } from "./api/middlewares/bodyParser.setup.js";
import { swaggerSetup } from "./api/middlewares/swagger.js";
import { authenticationRouter } from "./api/routes/auth.route.js";
import { budgetRouter } from "./api/routes/budget.route.js";
import { logger } from "./api/middlewares/winston.logger.js";
import { trackingRouter } from "./api/routes/tracking.route.js";

const app = express();

let dbUrl = process.env.DEVELOPMENT_DB_URL;

const PORT = process.env.PORT || 3000;

if (process.env.NOVE_ENV === "production"){
    dbUrl = process.env.PRODUCTION_DB_URL;
}

connectDB(dbUrl);

bodyParserSetup();

swaggerSetup();

app.use(express.json());
app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1/budget", budgetRouter);
app.use("/api/v1/tracking", trackingRouter);

app.listen(PORT, () => {
    logger.info("Server is up and running.");
});

export {app};
