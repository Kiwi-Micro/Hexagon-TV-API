from flask import Flask, request, jsonify
import mysql.connector
import os
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

emailPattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
thumbnailsUploadFolder = "/var/www/hexCDN/thumbnails/"
videosUploadFolder = "/var/www/hexCDN/videos/"
configPath = "/hexagontv/password.txt"

os.makedirs(thumbnailsUploadFolder, exist_ok=True)
os.makedirs(videosUploadFolder, exist_ok=True)

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

@app.route("/uploadThumbnail", methods=["POST"])
def uploadThumbnail():
	username = request.form.get("username")
	sessionId = request.form.get("sessionId")

	if not all([username, sessionId]) or "file" not in request.files:
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"status": "missing parameters"}), 400

	filePath = os.path.join(thumbnailsUploadFolder, file.filename)
	file.save(filePath)
	return jsonify({"status": "success"}), 200

@app.route("/uploadVideo", methods=["POST"])
def uploadVideo():
	username = request.form.get("username")
	sessionId = request.form.get("sessionId")

	if not all([username, sessionId]) or "file" not in request.files:
		return jsonify({"status": "missing parameters"}), 400

	if not auth(sessionId, username):
		return jsonify({"status": "invalid credentials"}), 403

	file = request.files["file"]
	if file.filename == "":
		return jsonify({"status": "missing parameters"}), 400

	filePath = os.path.join(videosUploadFolder, file.filename)
	file.save(filePath)
	return jsonify({"status": "success"}), 200

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=8081)