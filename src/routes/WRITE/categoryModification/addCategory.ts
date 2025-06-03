import { Router } from "express";
import { addCategory } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";
import { getUserPermissions } from "../../../utils/permissions";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";

const router = Router();

router.post("/addCategory", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyCategories,
		)
	) {
		try {
			await addCategory(req.body);
			sendAnalyticsEvent(req.body.userId as string, "api.categories.addCategory");
			res.json({ status: "success" });
		} catch (error: any) {
			sendAnalyticsEvent(req.body.userId as string, "api.categories.addCategory.failed");
			console.error("Error adding category:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.categories.addCategory.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
