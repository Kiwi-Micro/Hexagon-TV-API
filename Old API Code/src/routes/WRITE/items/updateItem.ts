import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";
import { updateItem } from "../../../utils/items";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/updateItem", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).data?.canModifyItems,
		)
	) {
		const result = await updateItem(req.body);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.items.updateItem.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
