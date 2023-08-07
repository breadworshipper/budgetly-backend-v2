import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        ownerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: String
    }
);

categorySchema.index({ ownerId: 1, name: 1 }, { unique: true });

const categoryModel = mongoose.model("Category", categorySchema);

export {categoryModel};
