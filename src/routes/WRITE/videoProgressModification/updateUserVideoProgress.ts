import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { auth, sendAnalyticsEvent } from "../../../utils/database";
import { updateUserVideoProgress } from "../../../utils/videoProgress";

const router = Router();

router.post("/updateUserVideoProgress", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await updateUserVideoProgress(req.body);
			if (status) {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.videoProgress.updateUserVideoProgress",
				);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.videoProgress.updateUserVideoProgress.failed",
				);
				res.status(409).json({ status: "user not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.videoProgress.updateUserVideoProgress.failed",
			);
			console.error("Error updating user progress:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.videoProgress.updateUserVideoProgress.failed",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
