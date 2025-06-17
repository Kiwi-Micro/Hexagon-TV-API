import { Router } from "express";
import { getUserPermissions } from "../../utils/permissions";
import { printEndpointReached } from "../../utils/messages";
import { sendAnalyticsEvent } from "../../utils/database";

const router = Router();

router.get("/getUserPermissions", async (req, res) => {
	const result = await getUserPermissions(req.query.userId as string);

	res.status(result.httpStatus).json({ ...result.data, status: result.status });
	sendAnalyticsEvent(req.query.userId as string, result.analyticsEventType);
	printEndpointReached(req, res);
});

export default router;
