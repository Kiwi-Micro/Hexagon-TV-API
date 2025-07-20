import { Router } from "express";
import { getUserPermissions } from "../../utils/permissions";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getUserPermissions", async (req, res) => {
	if (!req.query.userId) {
		res.status(400).json({ status: "missing parameters", data: null });
		sendAnalyticsEvent(
			req.query.userId as string,
			"api.permissions.getUserPermissions.missingParameters",
		);
		return;
	}

	const result = await getUserPermissions(req.query.userId as string);

	res.status(result.httpStatus).json({ data: result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
