import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {
        name: String,
        isExpense: Boolean,
        date: { type: Date, default: Date.now },
        category: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }],
        amount: Number,
        owner : {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }
);

const trackingModel = mongoose.model("Tracking", trackingSchema);

export { trackingModel };
