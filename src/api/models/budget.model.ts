import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            require: true
        },
        name: String,
        currentSpending: {
            type: Number,
            default: 0
        },
        target: {
            type: Number,
            require: true
        },
        startDate: {
            type: Date,
            default: Date.now()
        },
        endDate: {
            type: Date,
            require: true
        },
    }
);

const budgetModel = mongoose.model("Budget", budgetSchema);

export {budgetModel};
