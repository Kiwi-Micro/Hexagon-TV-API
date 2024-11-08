from flask import Flask, request, jsonify
import json

app = Flask(__name__)

def loadData(path):
    with open(path, 'r') as file:
        return json.load(file)

def setCorsHeaders(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

ratings = loadData('ratings.json')

@app.route('/ratings', methods=['GET'])
def getRatings():
    return setCorsHeaders(jsonify(ratings))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
