# Made by Malcolm @ Hexagon TV 2024
import mysql.connector

configPath = "/hexagontv/password.txt"

try:
	with open(configPath, 'r') as file:
		dbPassword = file.readline().strip()
except FileNotFoundError:
	raise RuntimeError(f"Configuration file not found at {configPath}")

try:
	moviesConnection = mysql.connector.connect(
		host="localhost",
		user="hexagon",
		password=dbPassword,
		database="hexagonMoviedb"
	)
	usersConnection = mysql.connector.connect(
		host="localhost",
		user="hexagon",
		password=dbPassword,
		database="hexagonUsersdb"
	)
	usersCursor = usersConnection.cursor()
	moviesCursor = moviesConnection.cursor()
except mysql.connector.Error as err:
	raise RuntimeError(f"Database connection failed: {err}")

# --- Table Creation ---
# --- Movies Setup ---

moviesCursor.execute("""
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
moviesCursor.execute("""
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
moviesCursor.execute("""
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

# --- Users Setup ---

usersCursor.execute("""
CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(32) PRIMARY KEY,
	passwordCheckSum LONGTEXT,
	email VARCHAR(255)
)
""")
usersCursor.execute("""
CREATE TABLE IF NOT EXISTS sessions (
	username VARCHAR(32),
	sessionUUID CHAR(36) PRIMARY KEY,
	expires DATE
)
""")
usersCursor.execute("""
CREATE TABLE IF NOT EXISTS watchlist (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	urlName VARCHAR(255) NOT NULL,
	thumbnailURL VARCHAR(255) NOT NULL
)
""")
usersCursor.execute("""
CREATE TABLE IF NOT EXISTS continueWatching (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	urlName VARCHAR(255) NOT NULL,
	thumbnailURL VARCHAR(255) NOT NULL
)
""")