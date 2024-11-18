from flask import Flask, jsonify

app = Flask(__name__)

def setCorsHeaders(response):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
	response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
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
	try:
		response = ratings
		return setCorsHeaders(jsonify(response))
	except Exception as e:
		errorMessage = {"error": str(e)} if app.debug else {"error": "Internal server error"}
		return setCorsHeaders(jsonify(errorMessage)), 500

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8081)
