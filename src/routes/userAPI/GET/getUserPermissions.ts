import { Router } from "express";
import { getUserPermissions } from "../../../utils/permissions";
import { printEndpointReached } from "../../../utils/messages";
import { sendAnalyticsEvent } from "../../../utils/database";

const router = Router();

router.get("/getUserPermissions", async (req, res) => {
	try {
		sendAnalyticsEvent(req.query.userId as string, "api.get.user.getUserPermissions");
		res.json(await getUserPermissions(req.query.userId as string));
	} catch (error: any) {
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.get.user.getUserPermissions.failed",
		);
		console.error("Error fetching permissions:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
