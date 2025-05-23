import { Router } from "express";
import { getCategories } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getCategories", async (req, res) => {
	try {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getCategories");
		res.json(await getCategories());
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.get.video.getCategories.failed");
		console.error("Error fetching categories:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
