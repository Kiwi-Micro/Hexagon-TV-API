import { ResultSet } from "@libsql/client";
import { runSQL } from "./database";
import { parseCategories, ReturnData, type Category } from "./types";

/**
 * Gets all categories from the database.
 * @returns An array of categories.
 */

export async function getCategories(): Promise<ReturnData<Category[]>> {
	try {
		const dbResults: ResultSet = await runSQL(false, "SELECT * FROM categories", false);

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.categories.getCategories",
			data: parseCategories(dbResults),
		};
	} catch (error: any) {
		console.error("Error getting categories:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.categories.getCategories.failed",
			data: null,
		};
	}
}

/**
 * Gets all categories from the database.
 * @returns An array of categories.
 */

export async function getCategory(id: number): Promise<ReturnData<Category>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM categories WHERE id = ?",
			true,
			[id],
		);

		if (dbResults.rows.length === 0) {
			return {
				status: "category not found",
				httpStatus: 404,
				analyticsEventType: "api.categories.getCategory.failed",
				data: null,
			};
		}

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.categories.getCategory",
			data: parseCategories(dbResults)[0],
		};
	} catch (error: any) {
		console.error("Error getting category:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.categories.getCategory.failed",
			data: null,
		};
	}
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, throws error otherwise.
 */

export async function addCategory(data: Category): Promise<ReturnData<null>> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO categories (name, urlName, isSeries) VALUES (?, ?, ?)",
			true,
			[data.name, data.urlName, data.isSeries],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.categories.addCategory",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.categories.addCategory.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error adding category:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.categories.addCategory.failed",
			data: null,
		};
	}
}

/**
 * This function updates a category in the database.
 * @param data The data to update the category.
 * @returns True if the category was updated, throws error otherwise.
 */

export async function updateCategory(data: Category): Promise<ReturnData<null>> {
	try {
		const categoryData = (await getCategory(data.id)).data;
		if (categoryData == null) {
			return {
				status: "category not found",
				httpStatus: 404,
				analyticsEventType: "api.categories.updateCategory.failed",
				data: null,
			};
		}
		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE categories SET categoryName = ?, urlName = ?, isSeries = ? WHERE id = ?",
			true,
			[
				data.name || categoryData.name,
				data.urlName || categoryData.urlName,
				data.isSeries || categoryData.isSeries,
				data.id,
			],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.categories.updateCategory",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.categories.updateCategory.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error updating category:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.categories.updateCategory.failed",
			data: null,
		};
	}
}

/**
 * This function deletes a category from the database.
 * @param data The data to delete the category.
 * @returns True if the category was deleted, throws error otherwise.
 */

export async function deleteCategory(data: any): Promise<ReturnData<null>> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"DELETE FROM categories WHERE id = ?",
			true,
			[data.id],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.categories.deleteCategory",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.categories.deleteCategory.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error deleting category:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.categories.deleteCategory.failed",
			data: null,
		};
	}
}
