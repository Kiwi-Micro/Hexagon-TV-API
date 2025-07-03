import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { getUserVideoProgress } from "../../utils/videoProgress";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getUserVideoProgress", async (req, res) => {
	if (!req.query.userId || !req.query.videoId) {
		res.status(400).json({ status: "missing parameters", data: null });
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.videoProgress.getUserVideoProgress.missingParameters",
		);
		return;
	}
	const result = await getUserVideoProgress(
		req.query.userId as string,
		req.query.videoId as string,
	);

	res.status(result.httpStatus).json({ data: result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
