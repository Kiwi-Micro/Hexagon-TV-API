import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";
import { updateVideo } from "../../../../utils/video";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.post("/updateVideo", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyVideos,
		)
	) {
		try {
			const status = await updateVideo(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.update.updateVideo", req.body);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.update.updateVideo.failed",
					req.body,
				);
				res.status(409).json({ status: "video not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.update.updateVideo.failed",
				req.body,
			);
			console.error("Error adding video:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.update.updateVideo.invalidCredentials",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
