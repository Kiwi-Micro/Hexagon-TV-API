# Commands Used A Lot in the Dev Environment:

## Server

```bash
bun run dev
```

## Testing API

### Video

#### GET

```bash
curl -X GET http://localhost:8070/videoAPI/search?query=V
```

```bash
curl -X GET http://localhost:8070/videoAPI/getVideos
```

#### POST

```bash
curl -X POST http://localhost:8070/videoAPI/addVideo \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "name": "Test", "description": "test", "thumbnailURL": "url", "videoURL": "url", "date": "Wed Apr 16 2025 12:51:48 GM", "urlName": "test", "ageRating": "G", "category": "test"}'
```

```bash
curl -X POST http://localhost:8070/videoAPI/updateVideo \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "name": "Test Updated", "description": "test", "thumbnailURL": "url", "videoURL": "url", "date": "Wed Apr 16 2025 12:51:48 GMT", "urlName": "test", "ageRating": "G", "category": "test", "id": "1"}'
```

#### DELETE

```bash
curl -X DELETE http://localhost:8070/videoAPI/deleteVideo \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id": "1"}'
```

#### Category

### GET

```bash
curl -X GET http://localhost:8070/videoAPI/getCategories
```

#### POST

```bash
curl -X POST http://localhost:8070/videoAPI/addCategory \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "categoryName": "Test", "categoryId": "test", "isSeries": "true"}'
```

```bash
curl -X POST http://localhost:8070/videoAPI/updateCategory \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"12", "categoryName":"Testing","categoryId":"testing","isSeries":"true"}'
```

#### DELETE

```bash
curl -X DELETE http://localhost:8070/videoAPI/deleteCategory \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"12"}'
```

### Age Rating

#### GET

```bash
curl -X GET http://localhost:8070/videoAPI/getAgeRatings
```

#### POST

```bash
curl -X POST http://localhost:8070/videoAPI/addAgeRating \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "ageRating": "Test", "ageRatingInfo": "test"}'
```

```bash
curl -X POST http://localhost:8070/videoAPI/updateAgeRating \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "ageRating": "Test Updated", "ageRatingInfo": "testUpdated", "id": "4"}'
```

#### DELETE

```bash
curl -X DELETE http://localhost:8070/videoAPI/deleteAgeRating \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id": "4"}'
```

### Permissions

#### GET

```bash
curl -X GET http://localhost:8070/userAPI/getUserPermissions?userId=user_2rdeTiDjEc9AHoLTd1vig5rklWI
```

#### POST

```bash
curl -X POST http://localhost:8070/userAPI/updateUserPermissions \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"1", "isAdmin":"false"}'
```

```bash
curl -X POST http://localhost:8070/userAPI/updateUserPermissions \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"1", "isAdmin":"true"}'
```

#### DELETE

```bash
curl -X POST http://localhost:8070/userAPI/updateUserPermissions \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6a", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"1", "isAdmin":"false"}'
```

### Watchlist

#### GET

```bash
curl -X GET http://localhost:8070/userAPI/getWatchlist\?userId\=user_2rdeTiDjEc9AHoLTd1vig5rklWI
```

#### POST

```bash
curl -X POST http://localhost:8070/userAPI/addToWatchlist \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "videoId": "1"}'
```

#### DELETE

```bash
curl -X DELETE http://localhost:8070/userAPI/deleteFromWatchlist \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"sess_2vkpoy6mNF7nLkUFzn8j7nLlA6b", "userId":"user_2rdeTiDjEc9AHoLTd1vig5rklWI", "id":"70"}'
```
