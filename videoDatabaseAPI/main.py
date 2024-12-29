from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

configPath = "/hexagontv/password.txt"

def cleanUp(cursor, connection):
	try:
		cursor.close()
		connection.close()
	except Exception as e:
		raise RuntimeError(f"Error cleaning up: {e}")

def getDbConnection():
	try:
		with open(configPath, 'r') as file:
			dbPassword = file.readline().strip()

		return mysql.connector.connect(
			host="localhost",
			user="hexagon",
			password=dbPassword,
			database="hexagonTVdb"
		)
	except mysql.connector.Error as err:
		raise RuntimeError(f"Database connection failed: {err}")

def auth(sessionId, username):
	connection = getDbConnection()
	cursor = connection.cursor()

	try:
		query = """
		SELECT isAdmin FROM users
		WHERE username = %s
		"""
		cursor.execute(query, (username,))
		isAdmin = cursor.fetchall()
		if len(isAdmin) > 0 and isAdmin[0] == (1,):
			query = """
			SELECT sessionId FROM sessions
			WHERE sessionId = %s AND username = %s
			"""
			cursor.execute(query, (sessionId, username))
			results = cursor.fetchall()
			cleanUp(cursor, connection)
			if results:
				return True
			else:
				return False
		else:
			cleanUp(cursor, connection)
			return False
	except Exception as e:
		cleanUp(cursor, connection)
		raise RuntimeError(f"Error checking auth: {e}")
		return False

def loadData(category):
	try:
		connection = getDbConnection()
		cursor = connection.cursor()
		query = """
		SELECT * FROM videos WHERE category = %s
		"""
		cursor.execute(query, (category,))
		result = cursor.fetchall()
		columnNames = [desc[0] for desc in cursor.description]
		data = [
			{columnNames[i]: str(row[i]) if isinstance(row[i], (int, float)) else row[i] for i in range(len(row))}
			for row in result
		]
		cleanUp(cursor, connection)
		return data
	except Exception as e:
		cleanUp(cursor, connection)
		raise RuntimeError(f"Error loading data: {e}")

@app.route('/movies', methods=['GET'])
def getMovies(): 
	try:
		movies = loadData('movies')
		return jsonify(movies)
	except Exception as e:
		return jsonify({"status": "server error"}), 500

@app.route('/tvshows', methods=['GET'])
def getTvShows():
	try:
		tvshows = loadData('tvshows')
		return jsonify(tvshows)
	except Exception as e:
		return jsonify({"status": "server error"}), 500

@app.route('/documentaries', methods=['GET'])
def getDocumentaries():
	try:
		documentaries = loadData('documentaries')
		return jsonify(documentaries)
	except Exception as e:
		return jsonify({"status": "server error"}), 500

@app.route('/search', methods=['GET'])
def search():
	try:
		movies = loadData('movies')
		tvshows = loadData('tvshows')
		documentaries = loadData('documentaries')
		query = request.args.get('query')
		if not query:
			return jsonify({'status': 'missing parameters'}), 400
	
		query = query.strip().lower()

		results = []
		for content in [movies, tvshows, documentaries]:
			for item in content:
				name = item['name'].lower()
				if query in name or name.startswith(query) or name == query:
					results.append(item)

		return jsonify(results)
	except Exception as e:
		return jsonify({"status": "server error"}), 500

@app.route('/add', methods=['POST'])
def add():
	connection = getDbConnection()
	cursor = connection.cursor()
	data = request.get_json()
	name = data.get('name')
	thumbnailURL = data.get('thumbnailURL')
	videoURL = data.get('videoURL')
	description = data.get('description')
	urlName = data.get('urlName')
	ageRating = data.get('ageRating')
	category = data.get('category')
	username = data.get('username')
	sessionId = data.get('sessionId')

	if not all([name, thumbnailURL, videoURL, description, urlName, ageRating, category, username, sessionId]):
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	try:
		query = """
		INSERT INTO videos (name, description, thumbnailURL, videoURL, urlName, rating, category)
		VALUES (%s, %s, %s, %s, %s, %s, %s)
		"""
		cursor.execute(query, (name, description, thumbnailURL, videoURL, urlName, ageRating, category))
		connection.commit()
		cleanUp(cursor, connection)
		return jsonify({"status": "success"})
	except mysql.connector.IntegrityError:
		cleanUp(cursor, connection)
		return jsonify({"status": "entry already exists"}), 409
	except Exception as e:
		cleanUp(cursor, connection)
		return jsonify({"status": "server error"}), 500

@app.route('/delete', methods=['DELETE'])
def delete():
	connection = getDbConnection()
	cursor = connection.cursor()

	data = request.get_json()
	username = data.get('username')
	sessionId = data.get('sessionId')
	urlName = data.get('urlName')

	if not all([username, sessionId, urlName]):
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	try:
		query = """
		DELETE FROM videos
		WHERE urlName = %s
		"""
		cursor.execute(query, (urlName,))
		connection.commit()
		cleanUp(cursor, connection)
		return jsonify({"status": "success"})
	except Exception as e:
		cleanUp(cursor, connection)
		return jsonify({"status": "server error"}), 500

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080)
