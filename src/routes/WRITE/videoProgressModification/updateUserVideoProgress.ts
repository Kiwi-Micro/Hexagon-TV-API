import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { auth, sendAnalyticsEvent } from "../../../utils/database";
import { updateUserVideoProgress } from "../../../utils/videoProgress";

const router = Router();

router.post("/updateUserVideoProgress", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		const result = await updateUserVideoProgress(req.body);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.videoProgress.updateUserVideoProgress.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
