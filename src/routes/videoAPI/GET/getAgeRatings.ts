import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getAgeRatings } from "../../../utils/ageRating";

const router = Router();

router.get("/getAgeRatings", async (req, res) => {
	try {
		const results = await getAgeRatings();
		res.json(results);
	} catch (error: any) {
		console.error("Error fetching age ratings:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
