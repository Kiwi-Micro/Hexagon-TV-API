import { ResultSet } from "@libsql/client";
import { runSQL } from "./database";
import { parseCategories, type Category } from "./types";

/**
 * Gets all categorys from the database.
 * @returns An array of categorys.
 */

async function getCategories(): Promise<Category[] | null> {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM categories", false);
	return parseCategories(dbResults);
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, false otherwise.
 */

async function addCategory(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO categories (categoryName, urlName, isSeries) VALUES (?, ?, ?)",
		true,
		[data.categoryName, data.urlName, data.isSeries],
	);
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a category in the database.
 * @param data The data to update the category.
 * @returns True if the category was updated, false otherwise.
 */

async function updateCategory(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE categories SET categoryName = ?, urlName = ?, isSeries = ? WHERE id = ?",
		true,
		[data.categoryName, data.urlName, data.isSeries, data.id],
	);
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a category from the database.
 * @param data The data to delete the category.
 * @returns True if the category was deleted, false otherwise.
 */

async function deleteCategory(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"DELETE FROM categories WHERE id = ?",
		true,
		[data.id],
	);
	return dbResults.rowsAffected > 0;
}

export { getCategories, addCategory, updateCategory, deleteCategory };
