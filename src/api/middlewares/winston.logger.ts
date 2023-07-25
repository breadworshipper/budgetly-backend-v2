import winston from "winston";
import "winston-mongodb";

const { combine, timestamp, prettyPrint } = winston.format;

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.MongoDB({
        db : 'mongodb://localhost:27017/budgetlyDB',
        collection: "logs"
    })
  ],
  format: combine(timestamp(), prettyPrint()),
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}

export { logger };
