import express, { Application } from "express";
import cors from "cors";
import getVideoDataEndpoint from "./routes/videoAPI/GET/getVideoData";
import searchEndpoint from "./routes/videoAPI/GET/search";
import videoDeleteEndpoint from "./routes/videoAPI/POST/deleteVideo";
import videoAddEndpoint from "./routes/videoAPI/POST/addVideo";
import userGetWatchlistEndpoint from "./routes/userAPI/GET/watchlist";
import userAddToWatchlistEndpoint from "./routes/userAPI/POST/addToWatchlist";
import userRemoveFromWatchlistEndpoint from "./routes/userAPI/POST/removeToWatchlist";

const app: Application = express();
const port = 8070;

const corsOptions = {
	origin: "*",
	methods: ["GET", "POST", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
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
//app.use("/videoAPI", videoUploadEndpoint);
//app.use("/videoAPI", thumbnailUploadEndpoint);
app.use("/videoAPI", videoDeleteEndpoint);
app.use("/videoAPI", videoAddEndpoint);

// User API - Watchlist
app.use("/userAPI", userGetWatchlistEndpoint);
app.use("/userAPI", userAddToWatchlistEndpoint);
app.use("/userAPI", userRemoveFromWatchlistEndpoint);
