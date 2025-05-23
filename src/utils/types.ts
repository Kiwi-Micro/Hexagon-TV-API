import { ResultSet } from "@libsql/client";
import { getAgeRatingInfo } from "./ageRating";
import { runSQL } from "./database";
import { getWatchlist } from "./watchlist";

/**
 * The type for all the video Data.
 * @property id: The id of the video.
 * @property name: The name of the video.
 * @property description: The description of the video.
 * @property category: The category of the video.
 * @property thumbnailURL: The URL to get the thumbnail from.
 * @property videoURL: The URL to get the video from.
 * @property date: The date the video was released.
 * @property ageRating: The age rating of the video.
 * @property ageRatingInfo: The age rating information of the video.
 * @property urlName: The name to use for the URL.
 * @property isPartOfTVShow: Whether the video is part of a TV show.
 * @property tvShowId: The id of the TV show the video is part of (0 if not part of a TV show).
 * @property isInWatchlist: Whether the video is in the user's watchlist.
 * @property progressThroughVideo: The progress through the video.
 * @property isVideoCompleted: Whether the video is completed.
 */

type Video = {
	id: number;
	name: string;
	description: string;
	category: string;
	thumbnailURL: string;
	videoURL: string;
	thumbnailURLKey?: string;
	videoURLKey?: string;
	dateReleased: string;
	ageRating: string;
	ageRatingInfo: string;
	urlName: string;
	isPartOfTVShow: string;
	tvShowId: string;
	isInWatchlist: boolean;
	progressThroughVideo: number;
	isVideoCompleted: boolean;
};

/**
 * This function parses the videos from the database.
 * @param dbResults The videos from the database.
 * @returns The formatted videos.
 */

async function parseVideos(dbResults: any, userId: string): Promise<Video[]> {
	const watchlist = await getWatchlist(userId);
	const rows = dbResults.rows || [];
	const results = rows.map(async (row: any) => ({
		id: row.id as number,
		name: row.name,
		description: row.description,
		thumbnailURL: row.thumbnailURL,
		videoURL: row.videoURL,
		dateReleased: row.dateReleased,
		urlName: row.urlName,
		ageRating: row.ageRating,
		ageRatingInfo: getAgeRatingInfo(row.ageRating) || "Age Rating not found",
		category: row.category,
		videoUrlKey: row.videoURLKey,
		thumbnailUrlKey: row.thumbnailURLKey,
		isPartOfTVShow: row.isPartOfTVShow == 1 ? true : false,
		tvShowId: row.tvShowId,
		isInWatchlist: watchlist.find((watchlistVideo) => watchlistVideo.videoId === row.id)
			? true
			: false,
		progressThroughVideo: 0,
		isVideoCompleted: false,
	}));
	const dbUserResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM continueWatching WHERE userId = ?",
		true,
		[userId],
	);
	const userVideoProgressResults = dbUserResults.rows || [];
	const resolvedResults = await Promise.all(results);
	for (const userVideoProgressResult of userVideoProgressResults) {
		const video = resolvedResults.find(
			(result: any) => result.id === userVideoProgressResult.videoId,
		);
		if (video) {
			video.progressThroughVideo = userVideoProgressResult.progressThroughVideo;
			video.isVideoCompleted =
				userVideoProgressResult.isVideoCompleted == 1 ? true : false;
		}
	}
	return resolvedResults;
}

/**
 * The type for all the age rating Data.
 * @property id: The id of the age rating.
 * @property ageRating: The age rating.
 * @property ageRatingInfo: The age rating information.
 */

type ageRating = {
	id: number;
	ageRating: string;
	ageRatingInfo: string;
};

/**
 * This function parses the age ratings from the database.
 * @param dbResults The age ratings results from the database.
 * @returns The parsed age ratings.
 */

function parseAgeRatings(dbResults: any): ageRating[] {
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => ({
		id: row.id,
		ageRating: row.ageRating,
		ageRatingInfo: row.ageRatingInfo,
	}));
	return results;
}

/**
 * The type for all the watchlist Data.
 * @property id: The id of the watchlist.
 * @property userId: The userId of the user.
 * @property videoId: The id of the video.
 * @property video: The video data (See The `Video` Type).
 */

type Watchlist = {
	id: number;
	userId: string;
	videoId: string;
	video?: Video;
};

/**
 * This function parses the watchlist from the database.
 * @param dbResults The watchlist results from the database.
 * @param videoResults The video results from the database.
 * @returns The parsed watchlist.
 */

function parseWatchlist(dbResults: any, videoResults: any): Watchlist[] {
	const videoRows = videoResults.rows || [];
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => {
		const video = videoRows.find((videoRow: any) => videoRow.id === row.videoId);
		return {
			id: row.id,
			userId: row.userId,
			videoId: row.videoId,
			video: video,
		};
	});

	return results;
}

/**
 * The type for all the permission Data.
 * @property id: The id of the permission.
 * @property userId: The userId of the user.
 * @property isAdmin: Whether the user is an admin (WILL BYPASS OTHER PERMISSIONS IF TRUE).
 * @property canModifyPermissions: Whether the user can modify user permissions.
 * @property canModifyVideos: Whether the user can modify videos.
 * @property canModifyCategorys: Whether the user can modify categories.
 * @property canModifyTVShows: Whether the user can modify TV shows.
 * @property canModifyAgeRatings: Whether the user can modify age ratings.
 * @property canModifyTiers: Whether the user can modify tiers.
 * @property (COMMING SOON, NOT AVAILABLE) canModifyUserTier: Whether the user can modify their what tier a user is on.
 */

type Permission = {
	id: number;
	userId: string;
	isAdmin: boolean;
	canModifyPermissions: boolean;
	canModifyVideos: boolean;
	canModifyCategories: boolean;
	canModifyTVShows: boolean;
	canModifyAgeRatings: boolean;
	canModifyTiers: boolean;
	/*canModifyUserTier: boolean;*/
};

/**
 * This function parses the permissions from the database.
 * @param dbResults The permissions results from the database.
 * @returns The parsed permissions.
 */

function parsePermissions(dbResults: any): Permission[] {
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => ({
		id: row.id,
		userId: row.userId,
		isAdmin: row.isAdmin == 1 ? true : false,
		canModifyPermissions: row.canModifyPermissions == 1 ? true : false,
		canModifyVideos: row.canModifyVideos == 1 ? true : false,
		canModifyCategories: row.canModifyCategories == 1 ? true : false,
		canModifyTVShows: row.canModifyTVShows == 1 ? true : false,
		canModifyAgeRatings: row.canModifyAgeRatings == 1 ? true : false,
		canModifyTiers: row.canModifyTiers == 1 ? true : false,
	}));
	return results;
}

/**
 * The type for all the tier Data.
 * @property id: The id of the tier.
 * @property tierName: The name of the tier.
 * @property tierPriceUSD: The price of the tier in USD.
 * @property tierImage: The image for the tier banner.
 * @property tierURLName: The name to use for the URL of the tier.
 */

type Tier = {
	id: number;
	tierName: string;
	tierPriceUSD: string;
	tierImage: string;
	tierURLName: string;
};

/**
 * This function parses the tiers from the database.
 * @param dbResults The tiers results from the database.
 * @returns The parsed tiers.
 */

function parseTiers(dbResults: any): Tier[] {
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => ({
		id: row.id,
		tierName: row.tierName,
		tierPriceUSD: row.tierPriceUSD,
		tierImage: row.tierImage,
		tierURLName: row.tierURLName,
	}));
	return results;
}

/**
 * The type for all the category Data.
 * @property id: The id of the category.
 * @property categoryName: The name of the category.
 * @property urlName: The id of the category (Like a URLName).
 */

type Category = {
	id: number;
	categoryName: string;
	urlName: string;
	isSeries: boolean;
};

/**
 * This function parses the categories from the database.
 * @param dbResults The categories results from the database.
 * @returns The parsed categories.
 */

function parseCategories(dbResults: any): Category[] {
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => ({
		id: row.id,
		categoryName: row.categoryName,
		urlName: row.urlName,
		isSeries: row.isSeries == 1 ? true : false,
	}));
	return results;
}

/**
 * The type for all the video progress Data.
 * @property userId: The userId of the user.
 * @property videoId: The id of the video.
 * @property progress: The progress of the video.
 * @property isVideoCompleted: Whether the video is completed.
 */

type VideoProgress = {
	userId: string;
	videoId: string;
	progressThroughVideo: number;
	isVideoCompleted: boolean;
};

/**
 * This function parses the video progress from the database.
 * @param dbResults The video progress results from the database.
 * @returns The parsed video progress.
 */

function parseVideoProgress(dbResults: any): VideoProgress[] {
	const rows = dbResults.rows || [];
	const results = rows.map((row: any) => ({
		userId: row.userId,
		videoId: row.videoId,
		progressThroughVideo: row.progressThroughVideo,
		isVideoCompleted: row.isVideoCompleted == 1 ? true : false,
	}));
	return results;
}

export type { Video, Watchlist, Permission, ageRating, Tier, Category, VideoProgress };
export {
	parseAgeRatings,
	parseCategories,
	parsePermissions,
	parseTiers,
	parseVideos,
	parseWatchlist,
	parseVideoProgress,
};
