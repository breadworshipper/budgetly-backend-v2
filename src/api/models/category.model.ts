import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: String
    }
);

const categoryModel = mongoose.model("Category", categorySchema);

export {categoryModel};
