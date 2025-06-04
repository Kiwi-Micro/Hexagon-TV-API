import { Router } from "express";
import { addToWatchlist } from "../../../utils/watchlist";
import { auth, sendAnalyticsEvent } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";
import { Watchlist } from "../../../utils/types";

const router = Router();

router.post("/addToWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		const result = await addToWatchlist(req.body as Watchlist);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.watchlist.addToWatchlist.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
