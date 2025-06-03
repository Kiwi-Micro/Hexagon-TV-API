import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";
import { addTVShow } from "../../../utils/tvShow";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/addTVShow", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyTVShows,
		)
	) {
		try {
			const status = await addTVShow(req.body);
			if (status) {
				sendAnalyticsEvent(req.body.userId as string, "api.tvShows.addTVShow");
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(req.body.userId as string, "api.tvShows.addTVShow.failed");
				res.status(409).json({ status: "unable to add tv show" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(req.body.userId as string, "api.tvShows.addTVShow.failed");
			console.error("Error adding TV Show:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.tvShows.addTVShow.invalidCredentials",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
