import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";
import { deleteVideo } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.delete("/deleteVideo", async (req, res) => {
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
			const status = await deleteVideo(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.tvShows.deleteVideo");
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(req.body.userId as string, "api.tvShows.deleteVideo.failed");
				res.status(409).json({ status: "video not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(req.body.userId as string, "api.tvShows.deleteVideo.failed");
			console.error("Error deleting video:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.tvShows.deleteVideo.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
