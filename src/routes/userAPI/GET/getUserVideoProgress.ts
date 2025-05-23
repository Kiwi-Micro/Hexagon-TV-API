import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getUserVideoProgress } from "../../../utils/videoProgress";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getUserVideoProgress", async (req, res) => {
	try {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.get.user.getUserVideoProgress",
			req.query.videoId as string,
		);
		res.json(
			await getUserVideoProgress(req.query.userId as string, req.query.videoId as string),
		);
	} catch (error: any) {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.get.user.getUserVideoProgress.failed",
			req.query.videoId as string,
		);
		console.error("Error fetching permissions:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
