import { Router } from "express";
import { search } from "../../utils/search";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/search", async (req, res) => {
	try {
		res.json(await search(req.query.query as string, req.query.userId as string));
		sendAnalyticsEvent(req.query.userId as string, "api.search");
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.search.failed");
		console.error("Error fetching search results:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
