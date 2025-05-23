import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getAgeRatings } from "../../../utils/ageRating";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getAgeRatings", async (req, res) => {
	try {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getAgeRatings");
		res.json(await getAgeRatings());
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getAgeRatings.failed");
		console.error("Error fetching age ratings:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
