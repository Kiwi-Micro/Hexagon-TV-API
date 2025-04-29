import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";

async function getTiers() {
	const dbResults: ResultSet = await getDbConnection(false).execute(
		"SELECT * FROM tiers",
	);
	if (dbResults.rows.length === 0) {
		console.log("No tiers found");
		return null;
	}
	return dbResults.rows;
}

async function getTier(tierId: string) {
	const dbGetResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM tiers WHERE id = ?",
		args: [tierId],
	});
	if (dbGetResults.rows.length === 0) {
		console.log("No tier found");
		return null;
	}
	return dbGetResults.rows;
}

async function addTier(data: any) {
	console.log(data);
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "INSERT INTO tiers (tierName, tierPriceUSD, tierIncludes, tierImage, tierURLName) VALUES (?, ?, ?, ?, ?)",
		args: [
			data.tierName,
			data.tierPriceUSD,
			data.tierIncludes,
			data.tierImage,
			data.tierURLName,
		],
	});
	return dbResults.rowsAffected > 0;
}

async function updateTier(data: any) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "UPDATE tiers SET tierName = ?, tierPriceUSD = ?, tierIncludes = ?, tierImage = ?, tierURLName = ? WHERE id = ?",
		args: [
			data.tierName,
			data.tierPriceUSD,
			data.tierIncludes,
			data.tierImage,
			data.tierURLName,
			data.id,
		],
	});
	return dbResults.rowsAffected > 0;
}

async function deleteTier(data: any) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "DELETE FROM tiers WHERE id = ?",
		args: [data.id],
	});
	return dbResults.rowsAffected > 0;
}

export { getTiers, getTier, addTier, updateTier, deleteTier };
