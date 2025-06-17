import { Router } from "express";
import { search } from "../../utils/search";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/search", async (req, res) => {
	const result = await search(req.query.query as string, req.query.userId as string);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
