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
	canModifyAgeRating: boolean;
};

export type { Video, Watchlist, Permission };
