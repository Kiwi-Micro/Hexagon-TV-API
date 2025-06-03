import { Row } from "@libsql/client";
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
	isPartOfTVShow: number;
	tvShowId: number;
	isInWatchlist: boolean;
	progressThroughVideo: number;
	isVideoCompleted: boolean;
};

/**
 * This function parses the videos from the database.
 * @param dbResults The videos from the database.
 * @returns The formatted videos and TV Shows.
 * @returns The formatted videos.
 */

async function parseVideos(dbResults: any, userId: string): Promise<Video[]> {
	const dbUserProgressResults: Row[] =
		(
			await runSQL(false, "SELECT * FROM continueWatching WHERE userId = ?", true, [
				userId,
			])
		).rows || [];

	const results = (dbResults.rows || []).map(async (row: Video) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		thumbnailURL: row.thumbnailURL,
		videoURL: row.videoURL,
		dateReleased: row.dateReleased,
		urlName: row.urlName,
		ageRating: row.ageRating,
		ageRatingInfo: (await getAgeRatingInfo(row.ageRating)) || "Age Rating not found",
		category: row.category,
		videoUrlKey: row.videoURLKey,
		thumbnailUrlKey: row.thumbnailURLKey,
		isPartOfTVShow: row.isPartOfTVShow == 1 ? true : false,
		tvShowId: row.tvShowId,
		isInWatchlist: (await getWatchlist(userId)).find(
			(watchlistVideo) => watchlistVideo.videoId === row.id,
		)
			? true
			: false,
		progressThroughVideo:
			dbUserProgressResults.find(
				(userVideoProgressResult) => userVideoProgressResult.videoId === row.id,
			)?.progressThroughVideo || 0,
		isVideoCompleted:
			dbUserProgressResults.find(
				(userVideoProgressResult) => userVideoProgressResult.videoId === row.id,
			)?.isVideoCompleted == 1
				? true
				: false,
	}));
	return await Promise.all(results);
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
	const results = (dbResults.rows || []).map((row: any) => ({
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
	videoId: number;
	video?: Video;
};

/**
 * This function parses the watchlist from the database.
 * @param dbResults The watchlist results from the database.
 * @param videoResults The video results from the database.
 * @returns The parsed watchlist.
 */

function parseWatchlist(dbResults: any, videoResults: any): Watchlist[] {
	const results = (dbResults.rows || []).map((row: any) => {
		const video = (videoResults.rows || []).find(
			(videoRow: any) => videoRow.id === row.videoId,
		);
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
};

/**
 * This function parses the permissions from the database.
 * @param dbResults The permissions results from the database.
 * @returns The parsed permissions.
 */

function parsePermissions(dbResults: any): Permission[] {
	const results = (dbResults.rows || []).map((row: any) => ({
		id: row.id,
		userId: row.userId,
		isAdmin: row.isAdmin == 1 ? true : false,
		canModifyPermissions: row.canModifyPermissions == 1 ? true : false,
		canModifyVideos: row.canModifyVideos == 1 ? true : false,
		canModifyCategories: row.canModifyCategories == 1 ? true : false,
		canModifyTVShows: row.canModifyTVShows == 1 ? true : false,
		canModifyAgeRatings: row.canModifyAgeRatings == 1 ? true : false,
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
	const results = (dbResults.rows || []).map((row: any) => ({
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
	const results = (dbResults.rows || []).map((row: any) => ({
		userId: row.userId,
		videoId: row.videoId,
		progressThroughVideo: row.progressThroughVideo,
		isVideoCompleted: row.isVideoCompleted == 1 ? true : false,
	}));

	return results;
}

/**
 * The type for all the TV Show Data.
 * @property id: The id of the TV Show.
 * @property name: The name of the TV Show.
 * @property description: The description of the TV Show.
 * @property urlName: The name to use for the URL.
 * @property thumbnailURL: The URL to get the thumbnail from.
 * @property thumbnailURLKey: The key to use for the thumbnail.
 * @property dateReleased: The date the TV Show was released.
 * @property ageRating: The age rating of the TV Show.
 * @property ageRatingInfo: The age rating information of the TV Show.
 * @property category: The category of the TV Show.
 * @property isInWatchlist: Whether the TV Show is in the user's watchlist.
 * @property nextEpisodeId: The id of the next episode.
 * @property episodeStatus: The episode status of the TV Show.
 */

type TVShow = {
	id: number;
	name: string;
	description: string;
	urlName: string;
	thumbnailURL: string;
	thumbnailURLKey?: string;
	dateReleased: string;
	ageRating: string;
	ageRatingInfo?: string;
	category: string;
	isInWatchlist?: boolean;
	nextEpisodeId?: number;
	episodeStatus?: [id: number, isWatched: boolean];
	isTVShowCompleted?: boolean;
};

/**
 * This function parses the TV Shows from the database.
 * @param dbResults The TV Shows results from the database.
 * @param userId The userId of the user to get the TV Shows for.
 * @returns The parsed TV Shows.
 */

async function parseTVShows(dbResults: any, userId: string): Promise<TVShow[]> {
	const results = (dbResults.rows || []).map(async (row: TVShow) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		urlName: row.urlName,
		thumbnailURL: row.thumbnailURL,
		thumbnailUrlKey: row.thumbnailURLKey,
		dateReleased: row.dateReleased,
		ageRating: row.ageRating,
		ageRatingInfo: (await getAgeRatingInfo(row.ageRating)) || "Age Rating not found",
		category: row.category,
		isInWatchlist: (await getWatchlist(userId)).find(
			(watchlistVideo) => watchlistVideo.videoId === row.id,
		)
			? true
			: false,
		nextEpisodeId: 0,
		episodeStatus: [],
		isTVShowCompleted: false,
	}));
	return await Promise.all(results);
}

export type { Video, Watchlist, Permission, ageRating, Category, VideoProgress, TVShow };
export {
	parseAgeRatings,
	parseCategories,
	parsePermissions,
	parseVideos,
	parseWatchlist,
	parseVideoProgress,
	parseTVShows,
};
