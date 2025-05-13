import { Router } from "express";
import { getCategories } from "../../../utils/category";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getCategories", async (req, res) => {
	try {
		res.json(await getCategories());
	} catch (error: any) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
