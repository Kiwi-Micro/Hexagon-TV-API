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
			).data?.canModifyCategories,
		)
	) {
		const result = await updateCategory(req.body);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
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
