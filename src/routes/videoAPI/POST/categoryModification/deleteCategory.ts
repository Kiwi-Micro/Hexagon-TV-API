import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../../utils/database";
import { deleteCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";

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
			const status = await deleteCategory(req.body);
			if (status) {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.delete.deleteCategory",
					req.body,
				);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.delete.deleteCategory.failed",
					req.body,
				);
				res.status(409).json({ status: "category not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.delete.deleteCategory.failed",
				req.body,
			);
			console.error("Error deleting category:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.delete.deleteCategory.invalidCredentials",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
