import { Router } from "express";
import { getVideosForSearch } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/search", async (req, res) => {
	try {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.get.video.search",
			req.query.query as string,
		);
		res.json(
			await getVideosForSearch(req.query.query as string, req.query.userId as string),
		);
	} catch (error: any) {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.get.video.search.failed",
			req.query.query as string,
		);
		console.error("Error fetching videos:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
