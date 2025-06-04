import { Router } from "express";
import { getVideos } from "../../utils/video";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getVideos", async (req, res) => {
	const result = await getVideos(req.query.userId as string);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
