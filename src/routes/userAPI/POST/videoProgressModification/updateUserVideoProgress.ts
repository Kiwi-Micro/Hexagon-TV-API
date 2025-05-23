import { Router } from "express";
import { printEndpointReached } from "../../../../utils/messages";
import { auth, sendAnalyticsEvent } from "../../../../utils/database";
import { updateUserVideoProgress } from "../../../../utils/videoProgress";

const router = Router();

router.post("/updateUserVideoProgress", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await updateUserVideoProgress(req.body);
			if (status) {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.update.user.updateUserVideoProgress",
					req.body,
				);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.update.user.updateUserVideoProgress.failed",
					req.body,
				);
				res.status(409).json({ status: "user not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.update.user.updateUserVideoProgress.failed",
				req.body,
			);
			console.error("Error updating user progress:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.update.user.updateUserVideoProgress.failed",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
