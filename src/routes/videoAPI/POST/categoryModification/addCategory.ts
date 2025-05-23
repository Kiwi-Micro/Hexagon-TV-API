import { Router } from "express";
import { addCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../../utils/database";

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
			const status = await addCategory(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.add.addCategory", req.body);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.add.addCategory.failed",
					req.body,
				);
				res.status(409).json({ status: "unable to add category" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.add.addCategory.failed",
				req.body,
			);
			console.error("Error adding category:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.add.addCategory.invalidCredentials",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
