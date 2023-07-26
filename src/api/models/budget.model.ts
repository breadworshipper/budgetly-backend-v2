import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: String,
        currentSpending: Number,
        target: Number,
        startDate: {
            type: Date,
            default: Date.now()
        },
        endDate: Date,
    }
);

const budgetModel = mongoose.model("Budget", budgetSchema);

export {budgetModel};
