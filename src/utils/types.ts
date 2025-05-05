type Video = {
	id: number;
	name: string;
	description: string;
	category: string;
	thumbnailURL: string;
	videoURL: string;
	date: string;
	ageRating: string;
	ageRatingInfo: string;
	urlName: string;
	isPartOfTVShow: string;
	tvShowId: string;
	isInWatchlist: boolean;
	progressThroughVideo: number;
	isVideoCompleted: boolean;
};

type ageRating = {
	id: number;
	ageRating: string;
	ageRatingInfo: string;
};

type Watchlist = {
	id: number;
	userId: string;
	videoId: string;
	video?: Video;
};

type Permission = {
	id: number;
	userId: string;
	isAdmin: boolean;
	canModifyPermissions: boolean;
	canModifyVideos: boolean;
	canModifyCategorys: boolean;
	canModifyTVShows: boolean;
	canModifyAgeRatings: boolean;
	canModifyTiers: boolean;
};

export type { Video, Watchlist, Permission, ageRating };
