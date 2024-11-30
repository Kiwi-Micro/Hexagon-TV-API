from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

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
	try:
		response = ratings
		return jsonify(response)
	except Exception as e:
		return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8081)
