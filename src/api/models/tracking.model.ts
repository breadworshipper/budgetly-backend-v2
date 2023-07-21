import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {   
        name: String,
        isExpense: Boolean,
        date: {type: Date, default: Date.now},
        category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
        amount: Number
    }
);

const trackingmodel = mongoose.model("Tracking", trackingSchema);

export {trackingmodel};
