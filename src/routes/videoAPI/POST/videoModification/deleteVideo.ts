import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";
import { deleteVideo } from "../../../../utils/video";
import { printEndpointReached } from "../../../../utils/messages";

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
				sendAnalyticsEvent(req.body.userId as string, "api.delete.deleteVideo", req.body);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.delete.deleteVideo.failed",
					req.body,
				);
				res.status(409).json({ status: "video not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.delete.deleteVideo.failed",
				req.body,
			);
			console.error("Error deleting video:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.delete.deleteVideo.invalidCredentials",
			req.body,
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
