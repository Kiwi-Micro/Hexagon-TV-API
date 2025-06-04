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
			).data.canModifyVideos,
		)
	) {
		const result = await deleteVideo(req.body);

		sendAnalyticsEvent(req.body.userId as string, result.analyticsEventType);
		res.status(result.httpStatus).json({ status: result.status });
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.videos.deleteVideo.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
