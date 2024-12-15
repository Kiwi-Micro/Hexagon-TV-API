# Made by Malcolm @ Hexagon TV 2024
import mysql.connector

passwordFilePath = "/hexagontv/password.txt"

try:
	with open(passwordFilePath, 'r') as file:
		dbPassword = file.readline().strip()
except FileNotFoundError:
	raise RuntimeError(f"Password File Not Found At {passwordFilePath}")

try:
	connection = mysql.connector.connect(
		host="localhost",
		user="hexagon",
		password=dbPassword,
		database="hexagonTVdb"
	)
	cursor = connection.cursor()
except mysql.connector.Error as err:
	raise RuntimeError(f"Database connection failed: {err}")

cursor.execute("""
CREATE TABLE IF NOT EXISTS videos (
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
CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(32) PRIMARY KEY,
	passwordCheckSum LONGTEXT,
	email VARCHAR(255),
	isAdmin BOOLEAN DEFAULT false
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS sessions (
	username VARCHAR(32),
	sessionId CHAR(36) PRIMARY KEY,
	expires DATE
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS watchlist (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	urlName VARCHAR(255) NOT NULL,
	thumbnailURL VARCHAR(255) NOT NULL
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS continueWatching (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	urlName VARCHAR(255) NOT NULL,
	thumbnailURL VARCHAR(255) NOT NULL
)
""")