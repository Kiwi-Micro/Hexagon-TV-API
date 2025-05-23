import { Router } from "express";
import { deleteFromWatchlist } from "../../../../utils/watchlist";
import { auth, sendAnalyticsEvent } from "../../../../utils/database";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.delete("/deleteFromWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await deleteFromWatchlist(req.body);
			if (status) {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.delete.deleteToWatchlist",
					req.body,
				);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.delete.deleteToWatchlist.failed",
					req.body,
				);
				res.status(409).json({ status: "watchlist item not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.delete.deleteToWatchlist.failed",
				req.body,
			);
			console.error("Error removing from watchlist:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.delete.deleteToWatchlist.failed",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
