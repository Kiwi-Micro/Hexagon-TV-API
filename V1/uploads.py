from flask import Flask, request, jsonify, json
import mysql.connector
import os
from flask_cors import CORS
import libsql_experimental as libsql
from datetime import datetime

app = Flask(__name__)

CORS(app)

thumbnailsUploadFolder = "/var/www/hexCDN/thumbnails/"
videosUploadFolder = "/var/www/hexCDN/videos/"

os.makedirs(thumbnailsUploadFolder, exist_ok=True)
os.makedirs(videosUploadFolder, exist_ok=True)

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
	app.run(host="0.0.0.0", port=8072)