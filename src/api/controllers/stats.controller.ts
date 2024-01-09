import { validateToken } from "../middlewares/validate.token.handler.js";
import { trackingModel } from "../models/tracking.model.js";
import { logger } from "../middlewares/winston.logger.js";
import { categoryModel } from "../models/category.model.js";
import { ObjectId } from "mongodb";

async function countTracking(req, res) {
  validateToken(req, res, async () => {
    const ownerId = req.user.id; // Assuming the userId is passed as a parameter

    console.log(`userId: ${ownerId}`)

    // Get the total amount of a user tracking
    const nonNullTrackingAmountTotal = await trackingModel.aggregate([
      {
        $match: {
          ownerId: new ObjectId(ownerId),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      }
    ]);

    // Stringify the result
    const nonNullTrackingAmountTotalString = JSON.stringify(nonNullTrackingAmountTotal);
    console.log(`nonNullTrackingAmountTotalString: ${nonNullTrackingAmountTotalString}`)
    
    // Get each category name and its total amount
    const categoryTotalAmount = await trackingModel.aggregate([
      {
        $match: {
          ownerId: new ObjectId(ownerId),
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // For each category, get the category name
    for (let i = 0; i < categoryTotalAmount.length; i++) {
      const categoryName = await categoryModel.findById(categoryTotalAmount[i]._id);
      categoryTotalAmount[i].percentage = categoryTotalAmount[i].totalAmount / nonNullTrackingAmountTotal[0].totalAmount * 100;
      categoryTotalAmount[i].categoryName = categoryName.name;
    }

    res.json(categoryTotalAmount)
  });
}

export {countTracking}
