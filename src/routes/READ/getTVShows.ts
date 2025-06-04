import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";
import { getTVShows } from "../../utils/tvShow";

const router = Router();

router.get("/getTVShows", async (req, res) => {
	const result = await getTVShows(req.query.userId as string);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
