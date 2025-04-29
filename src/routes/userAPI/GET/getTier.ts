import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getTier } from "../../../utils/tiers";

const router = Router();

router.get("/getTier", async (req, res) => {
	try {
		const results = await getTier(req.query.id as string);
		res.json(results);
	} catch (error: any) {
		console.error((("Error fetching tier:" + req.query.id) as string) + ":" + error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
