import express, { Application } from "express";
import cors from "cors";
import getWatchlistEndpoint from "./routes/userAPI/GET/watchlist";
import getUserPermissionsEndpoint from "./routes/userAPI/GET/getUserPermissions";
import addToWatchlistEndpoint from "./routes/userAPI/POST/watchlist/addToWatchlist";
import deleteFromWatchlistEndpoint from "./routes/userAPI/POST/watchlist/deleteFromWatchlist";
import getCategoriesEndpoint from "./routes/videoAPI/GET/getCategories";
import categoryAddEndpoint from "./routes/videoAPI/POST/categoryModification/addCategory";
import categoryUpdateEndpoint from "./routes/videoAPI/POST/categoryModification/updateCategory";
import categoryDeleteEndpoint from "./routes/videoAPI/POST/categoryModification/deleteCategory";
import getAgeRatingsEndpoint from "./routes/videoAPI/GET/getAgeRatings";
import getVideosEndpoint from "./routes/videoAPI/GET/getVideos";
import searchEndpoint from "./routes/videoAPI/GET/search";
import videoDeleteEndpoint from "./routes/videoAPI/POST/videoModification/deleteVideo";
import videoAddEndpoint from "./routes/videoAPI/POST/videoModification/addVideo";
import videoUpdateEndpoint from "./routes/videoAPI/POST/videoModification/updateVideo";
import uploadFilesEndpoint from "./routes/videoAPI/POST/videoModification/uploadFiles";
import updateUserPermissionsEndpoint from "./routes/userAPI/POST/permissionModification/updateUserPermissions";
import { createRouteHandler } from "uploadthing/express";
import config from "../config.json";

const app: Application = express();
// Config
const port = config[1]["PORT"] || 8070;
const corsOrigin = config[1]["CORS_ORIGIN"] || "*";

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

// Video API - GET
app.use("/videoAPI", getAgeRatingsEndpoint);
app.use("/videoAPI", getCategoriesEndpoint);
app.use("/videoAPI", getVideosEndpoint);
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
app.use("/videoAPI", categoryAddEndpoint);
app.use("/videoAPI", categoryUpdateEndpoint);
app.use("/videoAPI", categoryDeleteEndpoint);

// User API - GET
app.use("/userAPI", getUserPermissionsEndpoint);
app.use("/userAPI", getWatchlistEndpoint);

// User API - POST
app.use("/userAPI", updateUserPermissionsEndpoint);
app.use("/userAPI", addToWatchlistEndpoint);
app.use("/userAPI", deleteFromWatchlistEndpoint);
