from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

debug = True
configPath = "/hexagontv/password.txt"

def getDbConnection():
	try:
		with open(configPath, 'r') as file:
			dbPassword = file.readline().strip()
	except FileNotFoundError:
		raise RuntimeError(f"Configuration file not found at {configPath}")

	try:
		connection = mysql.connector.connect(
			host="localhost",
			user="hexagon",
			password=dbPassword,
			database="hexagonMoviedb"
		)
		return connection
	except mysql.connector.Error as err:
		raise RuntimeError(f"Database connection failed: {err}")

connection = getDbConnection()
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS movies (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	thumbnailURL VARCHAR(255),
	videoURL VARCHAR(255),
	date DATE,
	urlName VARCHAR(255) UNIQUE,
	rating VARCHAR(10),
	category VARCHAR(50)
);
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS tvshows (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	thumbnailURL VARCHAR(255),
	videoURL VARCHAR(255),
	date DATE,
	urlName VARCHAR(255) UNIQUE,
	rating VARCHAR(10),
	category VARCHAR(50)
);
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS documentaries (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	thumbnailURL VARCHAR(255),
	videoURL VARCHAR(255),
	date DATE,
	urlName VARCHAR(255) UNIQUE,
	rating VARCHAR(10),
	category VARCHAR(50)
);
""")

def loadData(tableName):
	try:
		query = f"SELECT * FROM {tableName}"
		cursor.execute(query)
		result = cursor.fetchall()
		columnNames = [desc[0] for desc in cursor.description]
		data = [
			{columnNames[i]: str(row[i]) if isinstance(row[i], (int, float)) else row[i] for i in range(len(row))}
			for row in result
		]
		return data
	except mysql.connector.Error as e:
		if debug:
			print(f"Error loading data from {tableName}: {e}")
		return []

movies = loadData('movies')
tvshows = loadData('tvshows')
documentaries = loadData('documentaries')

@app.route('/movies', methods=['GET'])
def getMovies():
	return jsonify(movies)

@app.route('/tvshows', methods=['GET'])
def getTvShows():
	return jsonify(tvshows)

@app.route('/documentaries', methods=['GET'])
def getDocumentaries():
	return jsonify(documentaries)

@app.route('/search', methods=['GET'])
def search():
	query = request.args.get('query')
	if not query:
		return jsonify({'error': 'No query provided'})
	
	query = query.strip().lower()
	if query == '':
		return jsonify({'error': 'Empty query'})

	results = []
	for content in [movies, tvshows, documentaries]:
		for item in content:
			name = item['name'].lower()
			if query in name or name.startswith(query) or name == query:
				results.append(item)

	return jsonify(results)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080)
