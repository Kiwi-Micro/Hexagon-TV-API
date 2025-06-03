import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";
import { addVideo } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/addVideo", async (req, res) => {
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
			const status = await addVideo(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.videos.addVideo");
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(req.body.userId as string, "api.videos.addVideo.failed");
				res.status(409).json({ status: "unable to add video" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(req.body.userId as string, "api.videos.addVideo.failed");
			console.error("Error adding video:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.videos.addVideo.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
