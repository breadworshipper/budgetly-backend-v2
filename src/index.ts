import express from "express";

const app = express();

const server = app.listen(3000, () => {
    console.log("Server is up and running.")
});
