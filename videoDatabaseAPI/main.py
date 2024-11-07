from flask import Flask, request, jsonify
import json

app = Flask(__name__)

def loadData(path):
    with open(path, 'r') as file:
        return json.load(file)

def setCorsHeaders(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://hexagon.kiwi-micro.com'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

ratings = loadData('ratings.json')
movies = loadData('videoDatabases/movies.json')
tvshows = loadData('videoDatabases/tvshows.json')
documentaries = loadData('videoDatabases/documentaries.json')

@app.route('/ratings', methods=['GET'])
def getRatings():
    return setCorsHeaders(jsonify(ratings))

@app.route('/movies', methods=['GET'])
def getMovies():
    return setCorsHeaders(jsonify(movies))

@app.route('/tvshows', methods=['GET'])
def getTVShows():
    return setCorsHeaders(jsonify(tvshows))

@app.route('/documentaries', methods=['GET'])
def getDocumentaries():
    return setCorsHeaders(jsonify(documentaries))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
