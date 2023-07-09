import mongoose from "mongoose";

async function connectDB(dbUrl: string){
    mongoose.connect(dbUrl);
}

export {connectDB};
