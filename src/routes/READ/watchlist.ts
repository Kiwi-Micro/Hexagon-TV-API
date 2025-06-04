import { Router } from "express";
import { getWatchlist } from "../../utils/watchlist";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getWatchlist", async (req, res) => {
	const result = await getWatchlist(req.query.userId as string);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
