# Hexagon TV API Documentation

## Contents

- [Endpoints](#endpoints)
- [Data Structures](#data-structures)

---

## Endpoints

List:

- api.hexagon.kiwi-micro.com:8080/userAPI/getWatchlist
- api.hexagon.kiwi-micro.com:8080/userAPI/addToWatchlist
- api.hexagon.kiwi-micro.com:8080/userAPI/removeFromWatchlist
- api.hexagon.kiwi-micro.com:8080/videoAPI/getVideoData
- api.hexagon.kiwi-micro.com:8080/videoAPI/search
- api.hexagon.kiwi-micro.com:8080/videoAPI/addVideo
- api.hexagon.kiwi-micro.com:8080/videoAPI/deleteVideo
- api.hexagon.kiwi-micro.com:8080/videoAPI/updateVideo

### Endpoints

#### api.hexagon.kiwi-micro.com:8080/userAPI/getWatchlist

URL: `api.hexagon.kiwi-micro.com:8080/userAPI/getWatchlist`
Method: `GET`

URL Params:

- username: The username of the user

Body:

- None

Response:
An array of [Watchlist Objects](#data-structures).

#### api.hexagon.kiwi-micro.com:8080/userAPI/addToWatchlist

URL: `api.hexagon.kiwi-micro.com:8080/userAPI/addToWatchlist`
Method: `POST`

URL Params:

- None

Body Params:

- username: The username of the user
- sessionId: The sessionId of the user
- userId: The userId of the user
- name: The name of the video
- urlName: The urlName of the video
- thumbnailUrl: The thumbnailUrl of the video

Response:

```json
{
	"status": "success | server error | invalid credentials"
}
```

#### api.hexagon.kiwi-micro.com:8080/userAPI/removeFromWatchlist

URL: `api.hexagon.kiwi-micro.com:8080/userAPI/removeFromWatchlist`
Method: `DELETE`

URL Params:

- None

Body Params:

- username: The username of the user
- sessionId: The sessionId of the user
- userId: The userId of the user
- urlName: The urlName of the video

Response:

```json
{
	"status": "success | server error | invalid credentials"
}
```

#### api.hexagon.kiwi-micro.com:8080/videoAPI/getVideoData

URL: `api.hexagon.kiwi-micro.com:8080/videoAPI/getVideoData`

Method: `GET`

URL Params:

- None

Body:

- None

Response:
An array of [Video Objects](#data-structures).

#### api.hexagon.kiwi-micro.com:8080/videoAPI/search

URL: `api.hexagon.kiwi-micro.com:8080/videoAPI/search`

Method: `GET`

URL Params:

- query: The query to search for

Body Params:

- None

Response:
An array of [Video Objects](#data-structures).

#### api.hexagon.kiwi-micro.com:8080/videoAPI/addVideo

URL: `api.hexagon.kiwi-micro.com:8080/videoAPI/addVideo`

Method: `POST`

URL Params:

- None

Body Params:

- video: The video to add of type [Video Object](#data-structures)

Response:

```json
{
	"status": "success | server error | invalid credentials"
}
```

#### api.hexagon.kiwi-micro.com:8080/videoAPI/deleteVideo

URL: `api.hexagon.kiwi-micro.com:8080/videoAPI/deleteVideo`

Method: `DELETE`

URL Params:

- None

Body Params:

- sessionId: The sessionId of the user
- userId: The userId of the user
- urlName: The urlName of the video

Response:

```json
{
	"status": "success | server error | invalid credentials"
}
```

#### api.hexagon.kiwi-micro.com:8080/videoAPI/updateVideo

URL: `api.hexagon.kiwi-micro.com:8080/videoAPI/updateVideo`

Method: `POST`

URL Params:

- None

Body Params:

- video: The video to add of type [Video Update Object](#data-structures)

Response:

```json
{
	"status": "success | server error | invalid credentials"
}
```

---

## Data Structures

### Video Object

- ID: Is the id of the video
- Name: Is the name of the video
- Description: Is the description of the video
- ThumbnailURL: Is the thumbnailURL of the video
- VideoURL: Is the videoURL of the video
- Date: Is the date when the video was uploaded
- URLName: Is the urlName of the video
- AgeRating: Is the age rating of the video
- AgeRatingInfo: Is the age rating info of the video
- Category: Is the category of the video

```json
{
	"id": 1,
	"name": "Movie Name",
	"description": "Movie Description",
	"thumbnailURL": "https://api.hexagon.kiwi-micro.com/thumbnails/movieNameThumbnail.png",
	"videoURL": "https://api.hexagon.kiwi-micro.com/movieNameVideo.png",
	"date": "2022-01-01",
	"urlName": "movieName",
	"ageRating": "G",
	"ageRatingInfo": "Age Rating Info",
	"category": "movies"
}
```

### Video Update Object

- ID: Is the id of the video
- Name: Is the name of the video
- Description: Is the description of the video
- ThumbnailURL: Is the thumbnailURL of the video
- VideoURL: Is the videoURL of the video
- Date: Is the date when the video was uploaded
- URLName: Is the urlName of the video
- AgeRating: Is the age rating of the video
- Category: Is the category of the video
- CurrentUrlName: Is the current urlName of the video

```json
{
	"id": 1,
	"name": "Movie Name",
	"description": "Movie Description",
	"thumbnailURL": "https://api.hexagon.kiwi-micro.com/thumbnails/movieNameThumbnail.png",
	"videoURL": "https://api.hexagon.kiwi-micro.com/movieNameVideo.png",
	"date": "2022-01-01",
	"urlName": "movieName",
	"ageRating": "G",
	"category": "movies",
	"currentUrlName": "movieName"
}
```

### Watchlist Object

- ID: Is the id of the video
- Name: Is the name of the video
- Description: Is the description of the video
- ThumbnailURL: Is the thumbnailURL of the video
- URLName: Is the urlName of the video
- Username: Is the username of the user

```json
{
	"id": 1,
	"name": "Movie Name",
	"thumbnailURL": "https://api.hexagon.kiwi-micro.com/thumbnails/movieNameThumbnail.png",
	"urlName": "movieName",
	"username": "username"
}
```
