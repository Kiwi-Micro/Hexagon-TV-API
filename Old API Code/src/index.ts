import express, { Application } from "express";
import cors from "cors";
import config from "../config.json";
import { createEndpoints } from "./utils/setup";

// Config
const port = config[1]["PORT"] || 8070;
const corsOrigin = config[1]["CORS_ORIGIN"] || "*";

const app: Application = express();

// Set CORS options
const corsOptions = {
	origin: corsOrigin,
	methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
	allowedHeaders: ["*"],
	credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// 404 - Not Found
app.get("/", (req, res) => {
	res.send("<pre>Cannot GET /</pre>");
});

// Logs that the server is running.
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

createEndpoints(app);
