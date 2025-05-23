import { Router } from "express";
import { getVideos } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getVideos", async (req, res) => {
	try {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getVideos");
		res.json(await getVideos(req.query.userId as string));
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getVideos.failed");
		console.error("Error fetching videos:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
