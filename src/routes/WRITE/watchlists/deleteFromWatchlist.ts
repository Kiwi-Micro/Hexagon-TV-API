import { Router } from "express";
import { deleteFromWatchlist } from "../../../utils/watchlist";
import { auth, sendAnalyticsEvent } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.delete("/deleteFromWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		const result = await deleteFromWatchlist(req.body);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.watchlist.deleteFromWatchlist.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
