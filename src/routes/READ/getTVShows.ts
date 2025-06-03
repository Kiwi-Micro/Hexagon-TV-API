import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";
import { getTVShows } from "../../utils/tvShow";

const router = Router();

router.get("/getTVShows", async (req, res) => {
	try {
		res.json(await getTVShows(req.query.userId as string));
		sendAnalyticsEvent(req.query.userId as string, "api.tvShows.getTVShows");
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.tvShows.getTVShows.failed");
		console.error("Error fetching TV Shows:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
