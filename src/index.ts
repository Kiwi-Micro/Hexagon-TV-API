import express, { Application } from "express";
import cors from "cors";
import { createEndpoints } from "./utils/setup";

// Config
const port = +(process.env.PORT || 8070);
const corsOrigin = process.env.CORS_ORIGIN || "*";

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
