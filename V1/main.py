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
		with open(configPath, "r") as file:
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
	except Exception as e:
		cleanUp(cursor, connection)
		raise RuntimeError(f"Error checking auth: {e}")
		return False

@app.route("/getWatchlist", methods=["GET"])
def getWatchlist():
	connection = getDbConnection()
	cursor = connection.cursor()
	username = request.args.get("username")

	if not username:
		return jsonify({"status": "missing parameters"}), 400

	try:
		query = """
		SELECT username, name, urlName, thumbnailURL 
		FROM watchlist 
		WHERE username = %s
		"""
		cursor.execute(query, (username,))
		result = cursor.fetchall()
		columnNames = [desc[0] for desc in cursor.description]
		data = [
			{columnNames[i]: str(row[i]) if isinstance(row[i], (int, float)) else row[i] for i in range(len(row))}
			for row in result
		]
		cleanUp(cursor, connection)
		return jsonify(data)
	except Exception as e:
		cleanUp(cursor, connection)
		return jsonify({"status": "server error"}), 500

@app.route("/addToWatchlist", methods=["POST"])
def addToWatchlist():
	connection = getDbConnection()
	cursor = connection.cursor()
	sessionId = request.json.get("sessionId")
	name = request.json.get("name")
	urlName = request.json.get("urlName")
	thumbnailUrl = request.json.get("thumbnailURL")
	username = request.json.get("username")

	if not all([sessionId, name, urlName, thumbnailUrl, username]):
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	try:
		query = """
		INSERT INTO watchlist (username, name, urlName, thumbnailURL)
		VALUES (%s, %s, %s, %s)
		"""
		cursor.execute(query, (username, name, urlName, thumbnailUrl))
		connection.commit()
		cleanUp(cursor, connection)
		return jsonify({"status": "success"})
	except mysql.connector.IntegrityError:
		cleanUp(cursor, connection)
		return jsonify({"status": "entry already exists"}), 409
	except Exception as e:
		cleanUp(cursor, connection)
		return jsonify({"status": "server error"}), 500

@app.route("/removeFromWatchlist", methods=["DELETE"])
def removeFromWatchlist():
	connection = getDbConnection()
	cursor = connection.cursor()
	sessionId = request.json.get("sessionId")
	urlName = request.json.get("urlName")
	username = request.json.get("username")

	if not urlName or not username:
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	try:
		query = """
		DELETE FROM watchlist
		WHERE urlName = %s AND username = %s
		"""
		cursor.execute(query, (urlName, username))
		connection.commit()
		cleanUp(cursor, connection)
		return jsonify({"status": "success"})
	except Exception as e:
		cleanUp(cursor, connection)
		return jsonify({"status": "server error"}), 500

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=8073)