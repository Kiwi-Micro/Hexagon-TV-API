import { Router } from "express";
import { getUserPermissions } from "../../../utils/permissions";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getUserPermissions", async (req, res) => {
	try {
		res.json(await getUserPermissions(req.query.userId as string));
	} catch (error: any) {
		console.error("Error fetching permissions:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
