import { Router } from "express";
import { getCategories } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getCategories", async (req, res) => {
	try {
		const results = await getCategories();
		res.json(results);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
