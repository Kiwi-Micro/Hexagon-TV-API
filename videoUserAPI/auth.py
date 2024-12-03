from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import mysql.connector
import uuid
import re
import bcrypt
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

debug = True
configPath = "/hexagontv/password.txt"
emailPattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

def hashPassword(password):
	if isinstance(password, str):
		password = password.encode('utf-8')

	return bcrypt.hashpw(password, bcrypt.gensalt())

def verifyPassword(password, storedPassword):
	if isinstance(password, str):
		password = password.encode('utf-8')

	if isinstance(storedPassword, str):
		storedPassword = storedPassword.encode('utf-8')

	return bcrypt.checkpw(password, storedPassword)

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
		return jsonify({"status": "Please fill in all fields!", "ID": "NONE"})

	try:
		query = "SELECT passwordCheckSum FROM users WHERE username = %s"
		dbCursor.execute(query, (username,))
		result = dbCursor.fetchone()

		if result and verifyPassword(passwordCheckSum, result[0]):
			newUuid = uuid.uuid4()
			setSessionUuid(newUuid, username)
			return jsonify({"status": "success", "ID": str(newUuid)})
		else:
			return jsonify({"status": "Incorrect Username or Password.", "ID": "NONE"})
	except Exception as e:
		return jsonify({"status": "Internal server error"})

@app.route('/register', methods=['POST'])
def registerUser():
	data = request.get_json()
	username = data.get('username')
	email = data.get('email')
	passwordCheckSum = hashPassword(data.get('passwordCheckSum'))

	if not isValidEmail(email):
		return jsonify({"status": "That is not a valid Email"})

	if not username or not passwordCheckSum or not email:
		return jsonify({"status": "Please fill in all fields!"})

	try:
		query = """
		INSERT INTO users (username, passwordCheckSum, email)
		VALUES (%s, %s, %s)
		"""
		dbCursor.execute(query, (username, passwordCheckSum, email))
		dbConnection.commit()
		return jsonify({"status": "success"})
	except mysql.connector.IntegrityError:
		return jsonify({"status": "User already exists"})
	except Exception as e:
		return jsonify({"status": "Internal server error"})

@app.route('/register', methods=['OPTIONS'])
def registerOptions():
	return jsonify()

@app.route('/delete', methods=['DELETE'])
def deleteUser():
	data = request.get_json()
	username = data.get('username')
	passwordCheckSum = data.get('passwordCheckSum')

	if not username or not passwordCheckSum:
		return jsonify({"status": "Please fill in all fields!"})

	try:
		query = "SELECT passwordCheckSum FROM users WHERE username = %s"
		dbCursor.execute(query, (username,))
		result = dbCursor.fetchone()

		if result and verifyPassword(passwordCheckSum, result[0]):
			dbCursor.execute("DELETE FROM users WHERE username = %s", (username,))
			dbCursor.execute("DELETE FROM sessions WHERE username = %s", (username,))
			dbCursor.execute("DELETE FROM watchlist WHERE username = %s", (username,))
			dbCursor.execute("DELETE FROM continueWatching WHERE username = %s", (username,))
			dbConnection.commit()
			return jsonify({"status": "success"})
		else:
			return jsonify({"status": "Incorrect Username or Password."})
	except Exception as e:
		return jsonify({"status": "Internal server error"})

@app.route('/delete', methods=['OPTIONS'])
def deleteOptions():
	return jsonify()

@app.route('/wipe', methods=['DELETE'])
def wipe():
	data = request.get_json()
	username = data.get('username')
	passwordCheckSum = data.get('passwordCheckSum')

	if not username or not passwordCheckSum:
		return jsonify({"status": "Please fill in all fields!"})

	try:
		query = "SELECT passwordCheckSum FROM users WHERE username = %s"
		dbCursor.execute(query, (username,))
		result = dbCursor.fetchone()

		if result and verifyPassword(passwordCheckSum, result[0]):
			dbCursor.execute("DELETE FROM watchlist WHERE username = %s", (username,))
			dbCursor.execute("DELETE FROM continueWatching WHERE username = %s", (username,))
			dbCursor.execute("DELETE FROM sessions WHERE username = %s", (username,))
			dbConnection.commit()
			return jsonify({"status": "success"})
		else:
			return jsonify({"status": "Incorrect Username or Password."})
	except Exception as e:
		return jsonify({"status": "Internal server error"})

@app.route('/wipe', methods=['OPTIONS'])
def wipeOptions():
	return jsonify()

@app.route('/logout', methods=['POST'])
def logout():
		data = request.get_json()
		username = data.get('username')
		userId = data.get('id')
		allSessions = data.get('all', False)  

		if not username or (not userId and not allSessions):
			return jsonify({"status": "Please fill in all fields!"})

		isValidSession = False
		getSessions = dbCursor.execute("SELECT sessionUUID FROM sessions WHERE username = %s", (username,))
		results = dbCursor.fetchall()
		for result in results:
			if result[0] == userId:
				isValidSession = True
				break

		if isValidSession:
			try:
				if allSessions:
					query = "DELETE FROM sessions WHERE username = %s"
					dbCursor.execute(query, (username,))
				else:
					query = "DELETE FROM sessions WHERE username = %s AND sessionUUID = %s"
					dbCursor.execute(query, (username, userId))

				dbConnection.commit()
				return jsonify({"status": "success"})
			except Exception as e:
				return jsonify({"status": "server error"})
		else:
			return jsonify({"status": "invalid credentials"})

@app.route('/logout', methods=['OPTIONS'])
def logoutOptions():
	return jsonify()

@app.route('/changePassword', methods=['PATCH'])
def changePassword():
	data = request.get_json()
	username = data.get('username')
	passwordCheckSum = data.get('oldPassword')
	newPassword = hashPassword(data.get('newPassword'))

	if not username or not passwordCheckSum or not newPassword:
		return jsonify({"status": "Please fill in all fields!"})

	try:
		query = "SELECT passwordCheckSum FROM users WHERE username = %s"
		dbCursor.execute(query, (username,))
		result = dbCursor.fetchone()

		if result and verifyPassword(passwordCheckSum, result[0]):
			dbCursor.execute("UPDATE users SET passwordCheckSum = %s WHERE username = %s", (newPassword, username))
			dbConnection.commit()
			return jsonify({"status": "success"})
		else:
			return jsonify({"status": "Incorrect Username or Password."})
	except Exception as e:
		return jsonify({"status": "Internal server error"})

@app.route('/changePassword', methods=['OPTIONS'])
def changePasswordOptions():
	return jsonify()

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8071)
