import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { getAgeRatings } from "../../utils/ageRating";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getAgeRatings", async (req, res) => {
	const result = await getAgeRatings();

	res.status(result.httpStatus).json({ data: result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
