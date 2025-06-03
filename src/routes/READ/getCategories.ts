import { Router } from "express";
import { getCategories } from "../../utils/category";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getCategories", async (req, res) => {
	try {
		res.json(await getCategories());
		sendAnalyticsEvent(req.query.userId as string, "api.categories.getCategories");
	} catch (error: any) {
		sendAnalyticsEvent(req.query.userId as string, "api.categories.getCategories.failed");
		console.error("Error fetching categories:", error.message);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
