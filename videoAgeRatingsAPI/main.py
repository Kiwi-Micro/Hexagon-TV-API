from flask import Flask, request, jsonify
import json

app = Flask(__name__)

def setCorsHeaders(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

ratings = [
    {
		"rating": "G",
		"description": "Suitable for all ages"
	},
	{
		"rating": "PG",
		"description": "Some material may not be suitable for children"
	},
	{
		"rating": "CTC",
		"description": "Check the classification closer to its release date"
	}
]

@app.route('/ratings', methods=['GET'])
def getRatings():
    return setCorsHeaders(jsonify(ratings))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
