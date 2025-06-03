import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { getUserVideoProgress } from "../../utils/videoProgress";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getUserVideoProgress", async (req, res) => {
	try {
		res.json(
			await getUserVideoProgress(req.query.userId as string, req.query.videoId as string),
		);
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.videoProgress.getUserVideoProgress",
		);
	} catch (error: any) {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.videoProgress.getUserVideoProgress.failed",
		);
		console.error("Error fetching permissions:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
