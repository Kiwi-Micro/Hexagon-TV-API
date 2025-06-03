import { Router } from "express";
import { addToWatchlist } from "../../../utils/watchlist";
import { auth, sendAnalyticsEvent } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/addToWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await addToWatchlist(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.watchlist.addToWatchlist");
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(req.body.userId as string, "api.watchlist.addToWatchlist");
				res.status(409).json({ status: "watchlist item not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(req.body.userId as string, "api.watchlist.addToWatchlist");
			console.error("Error adding to watchlist:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(req.body.userId as string, "api.watchlist.addToWatchlist");
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
