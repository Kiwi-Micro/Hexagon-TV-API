import express, { Application } from "express";
import cors from "cors";
import getVideoDataEndpoint from "./routes/videoAPI/GET/getVideoData";
import searchEndpoint from "./routes/videoAPI/GET/search";
import videoDeleteEndpoint from "./routes/videoAPI/POST/deleteVideo";
import videoAddEndpoint from "./routes/videoAPI/POST/addVideo";
import videoUpdateEndpoint from "./routes/videoAPI/POST/updateVideo";
import userGetWatchlistEndpoint from "./routes/userAPI/GET/watchlist";
import userAddToWatchlistEndpoint from "./routes/userAPI/POST/addToWatchlist";
import userRemoveFromWatchlistEndpoint from "./routes/userAPI/POST/removeToWatchlist";
import uploadFilesEndpoint from "./routes/videoAPI/POST/uploadFiles";
import { createRouteHandler } from "uploadthing/express";
import config from "../config.json";

const app: Application = express();
const port = 8070;

const corsOptions = {
	origin: "*",
	methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
	allowedHeaders: ["*"],
	credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
	res.send("<pre>Cannot GET /</pre>");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

// Video API - GET
app.use("/videoAPI", getVideoDataEndpoint);
app.use("/videoAPI", searchEndpoint);

// Video API - POST
app.use(
	"/api/uploadthing",
	createRouteHandler({
		router: uploadFilesEndpoint,
		config: {
			token: config[0]["UPLOADTHING_TOKEN"],
			logLevel: "Error",
		},
	}),
);
app.use("/videoAPI", videoDeleteEndpoint);
app.use("/videoAPI", videoAddEndpoint);
app.use("/videoAPI", videoUpdateEndpoint);

// User API - Watchlist
app.use("/userAPI", userGetWatchlistEndpoint);
app.use("/userAPI", userAddToWatchlistEndpoint);
app.use("/userAPI", userRemoveFromWatchlistEndpoint);
