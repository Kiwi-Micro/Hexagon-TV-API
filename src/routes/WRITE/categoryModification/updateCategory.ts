import { Router } from "express";
import { updateCategory } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";

const router = Router();

router.post("/updateCategory", async (req, res) => {
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
			await updateCategory(req.body);
			sendAnalyticsEvent(req.body.userId as string, "api.categories.updateCategory");
			res.json({ status: "success" });
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.categories.updateCategory.failed",
			);
			console.error("Error adding category:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.categories.updateCategory.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
