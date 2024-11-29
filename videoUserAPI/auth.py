from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import mysql.connector
import uuid
import re
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

debug = True
configPath = "/hexagontv/password.txt"
emailPattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

try:
	with open(configPath, 'r') as file:
		dbPassword = file.readline().strip()
except FileNotFoundError:
	raise RuntimeError(f"Configuration file not found at {configPath}")

try:
	dbConnection = mysql.connector.connect(
		host="localhost",
		user="hexagon",
		password=dbPassword,
		database="hexagonUsersdb"
	)
	dbCursor = dbConnection.cursor()
except mysql.connector.Error as err:
	raise RuntimeError(f"Database connection failed: {err}")

def isValidEmail(email):
	return re.match(emailPattern, email) is not None

def setSessionUuid(sessionUuid, username):
	expirationDate = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
	try:
		dbCursor.execute("SELECT COUNT(*) FROM sessions WHERE sessionUUID = %s;", (str(sessionUuid),))
		result = dbCursor.fetchone()

		if result[0] == 0:
			dbCursor.execute("INSERT INTO sessions (username, sessionUUID, expires) VALUES (%s, %s, %s);", (username, str(sessionUuid), expirationDate))
			dbConnection.commit()
	except Exception as e:
		if debug: print(f"Error setting session UUID: {e}")

@app.route('/auth', methods=['POST'])
def authenticateUser():
	data = request.get_json()
	username = data.get('username')
	passwordCheckSum = data.get('passwordCheckSum')

	if not username or not passwordCheckSum:
		return jsonify({"status": "Please fill in all fields! (400)", "ID": "NONE"})

	try:
		query = "SELECT passwordCheckSum FROM users WHERE username = %s"
		dbCursor.execute(query, (username,))
		result = dbCursor.fetchone()

		if result and result[0] == passwordCheckSum:
			newUuid = uuid.uuid4()
			setSessionUuid(newUuid, username)
			return jsonify({"status": "success", "ID": str(newUuid)})
		else:
			return jsonify({"status": "Incorrect Username or Password. (400)", "ID": "NONE"})
	except Exception as e:
		return jsonify({"status": "There was an error logging you in! Please try again later. (500)"})

@app.route('/register', methods=['POST'])
def registerUser():
	data = request.get_json()

	username = data.get('username')
	email = data.get('email')
	passwordCheckSum = data.get('passwordCheckSum')

	if not isValidEmail(email):
		return jsonify({"status": "That is not a valid Email (400)"})

	if not username or not passwordCheckSum or not email:
		return jsonify({"status": "Please fill in all fields! (400)"})

	try:
		query = """
		INSERT INTO users (username, passwordCheckSum, email)
		VALUES (%s, %s, %s)
		"""
		dbCursor.execute(query, (username, passwordCheckSum, email))
		dbConnection.commit()
		return jsonify({"status": "success"})
	except mysql.connector.IntegrityError:
		return jsonify({"status": "User already exists (400)"})
	except Exception as e:
		return jsonify({"status": "There was an error registering your account! Please try again later. (500)"})

@app.route('/register', methods=['OPTIONS'])
def options():
	return jsonify()

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8071)