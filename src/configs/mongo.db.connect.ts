import mongoose from "mongoose";

async function connectDB(dbUrl: string){
    mongoose.connect(dbUrl);
    console.log(`Connection established ${dbUrl}`);
}

export {connectDB}
