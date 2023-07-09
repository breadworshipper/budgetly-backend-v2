import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "_User"},
        name: String,
        currentSpending: Number,
        target: Number
    }
);

const budgetModel = mongoose.model("Budget", budgetSchema);

export {budgetModel};
