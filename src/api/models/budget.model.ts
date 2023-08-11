import mongoose from "mongoose";
import { oneMonthFromNow } from "../helpers/one.month.increment.js";

const budgetSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        name: String,
        currentSpending: {
            type: Number,
            default: 0
        },
        target: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now()
        },
        endDate: {
            type: Date,
            default: oneMonthFromNow
        },
        recurring: {
            type: Boolean,
            required: true
        },
        interval: { //Stored in numbers of day
            type: Number,
            default: null
        }
    }
);

const budgetModel = mongoose.model("Budget", budgetSchema);

export {budgetModel};
