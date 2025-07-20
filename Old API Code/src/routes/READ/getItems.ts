import { Router } from "express";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";
import { getItems } from "../../utils/items";

const router = Router();

router.get("/getItems", async (req, res) => {
	if (!req.query.type || !req.query.userId) {
		res.status(400).json({ status: "missing parameters", data: null });
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.items.getItems.missingParameters",
		);
		return;
	}

	let result = await getItems(req.query.userId as string, req.query.type as string);

	res.status(result.httpStatus).json({ data: result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
