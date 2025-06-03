import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { deleteCategory } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";
import { getUserPermissions } from "../../../utils/permissions";

const router = Router();

router.delete("/deleteCategory", async (req, res) => {
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
			await deleteCategory(req.body);
			sendAnalyticsEvent(req.body.userId as string, "api.categories.deleteCategory");
			res.json({ status: "success" });
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.categories.deleteCategory.failed",
			);
			console.error("Error deleting category:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.categories.deleteCategory.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
