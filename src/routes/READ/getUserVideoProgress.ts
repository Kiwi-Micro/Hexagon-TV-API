import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { getUserVideoProgress } from "../../utils/videoProgress";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getUserVideoProgress", async (req, res) => {
	const result = await getUserVideoProgress(
		req.query.userId as string,
		req.query.videoId as string,
	);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
