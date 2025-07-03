import { Router } from "express";
import { search } from "../../utils/items";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/search", async (req, res) => {
	if (!req.query.type || !req.query.userId || !req.query.query) {
		res.status(400).json({ status: "missing parameters", data: null });
		sendAnalyticsEvent(req.query.userId as string, "api.items.search.missingParameters");
		return;
	}

	const result = await search(
		req.query.query as string,
		req.query.userId as string,
		req.query.type as string,
	);

	res.status(result.httpStatus).json({ data: result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
