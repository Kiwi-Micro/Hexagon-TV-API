import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getTiers } from "../../../utils/tiers";

const router = Router();

router.get("/getTiers", async (req, res) => {
	try {
		res.json(await getTiers());
	} catch (error: any) {
		console.error("Error fetching tiers:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
