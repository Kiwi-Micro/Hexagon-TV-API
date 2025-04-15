import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";

/**
 * Gets all categorys from the database.
 * @returns An array of categorys.
 */

async function getCategories() {
	const dbResults: ResultSet = await getDbConnection(true).execute(
		"SELECT * FROM categories",
	);
	const results = dbResults.rows.map((row: any) => ({
		id: row.id,
		categoryName: row.categoryName,
		categoryId: row.categoryId,
		isSeries: row.isSeries,
	}));
	return results;
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, false otherwise.
 */

async function addCategory(data: any) {
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "INSERT INTO categories (categoryName, categoryId, isSeries) VALUES (?, ?, ?)",
		args: [data.categoryName, data.categoryId, data.isSeries],
	});
	return dbResults.rowsAffected > 0;
}

async function updateCategory(data: any) {
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "UPDATE categories SET categoryName = ?, categoryId = ?, isSeries = ? WHERE id = ?",
		args: [data.categoryName, data.categoryId, data.isSeries, data.id],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a category from the database.
 * @param data The data to delete the category.
 * @returns True if the category was deleted, false otherwise.
 */

async function deleteCategory(data: any) {
	const dbDeleteResults: ResultSet = await getDbConnection(false).execute({
		sql: "DELETE FROM categories WHERE categoryId = ?",
		args: [data.categoryId],
	});
	return dbDeleteResults.rowsAffected > 0;
}

export { getCategories, addCategory, updateCategory, deleteCategory };
