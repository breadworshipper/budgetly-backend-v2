import { validateToken } from "../middlewares/validate.token.handler.js";
import { trackingModel } from "../models/tracking.model.js";
import { logger } from "../middlewares/winston.logger.js";
import { categoryModel } from "../models/category.model.js";

async function countTracking(req, res) {
  
        validateToken(req, res, async () => {
            const nonNullTrackingCount = await trackingModel.countDocuments({ category: { $ne: null } });
    const categories = await categoryModel.find()
    const trackingCountPromises = categories.map(async (categoryObject) => {
        const categoryTotal = await trackingModel.countDocuments({ category: categoryObject.id });
        const categoryInfo = {
          categoryName: categoryObject.name,
          categoryTotal: categoryTotal,
          categoryPercentage: (categoryTotal / nonNullTrackingCount) * 100,
        };
        return categoryInfo;
      });
  
      const trackingCountList = await Promise.all(trackingCountPromises);
      
      logger.info(trackingCountList);
  
      res.send(trackingCountList);
        });
}

export {countTracking}
