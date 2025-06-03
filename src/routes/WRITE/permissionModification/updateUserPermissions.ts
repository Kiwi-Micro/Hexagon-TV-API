import { Router } from "express";
import {
	checkPermissionsAndAuthenticate,
	sendAnalyticsEvent,
} from "../../../utils/database";
import { getUserPermissions } from "../../../utils/permissions";
import { updateUserPermissions } from "../../../utils/permissions";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/updateUserPermissions", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyPermissions,
		)
	) {
		try {
			const status = await updateUserPermissions(req.body);
			if (status) {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.permissions.updateUserPermissions",
				);
				res.json({ status: "success" });
			} else {
				sendAnalyticsEvent(
					req.body.userId as string,
					"api.permissions.updateUserPermissions.failed",
				);
				res.status(409).json({ status: "user not found" });
			}
		} catch (error: any) {
			sendAnalyticsEvent(
				req.body.userId as string,
				"api.permissions.updateUserPermissions.failed",
			);
			console.error("Error updating user permissions:", error);
			res.status(500).json({ status: "server error" });
		}
	} else {
		sendAnalyticsEvent(
			req.body.userId as string,
			"api.permissions.updateUserPermissions.failed",
		);
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
