import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: String
    }
);

categorySchema.index({ owner: 1, name: 1 }, { unique: true });

const categoryModel = mongoose.model("Category", categorySchema);

export {categoryModel};
