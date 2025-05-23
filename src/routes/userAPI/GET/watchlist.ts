import { Router } from "express";
import { getWatchlist } from "../../../utils/watchlist";
import { printEndpointReached } from "../../../utils/messages";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getWatchlist", async (req, res) => {
	try {
		sendAnalyticsEvent(req.query.userId as string, "api.get.user.getWatchlist");
		res.json(await getWatchlist(req.query.userId as string));
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.get.user.getWatchlist.failed");
		console.error("Error fetching watchlist:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
