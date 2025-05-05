import { ResultSet } from "@libsql/client";
import { runSQL } from "./database";

async function getTiers() {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM tiers", false);
	if (dbResults.rows.length === 0) {
		console.log("No tiers found");
		return null;
	}
	return dbResults.rows;
}

async function getTier(tierId: string) {
	const dbGetResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM tiers WHERE id = ?",
		true,
		[tierId],
	);
	if (dbGetResults.rows.length === 0) {
		console.log("No tier found");
		return null;
	}
	return dbGetResults.rows;
}

async function addTier(data: any) {
	console.log(data);
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO tiers (tierName, tierPriceUSD, tierIncludes, tierImage, tierURLName) VALUES (?, ?, ?, ?, ?)",
		true,
		[
			data.tierName,
			data.tierPriceUSD,
			data.tierIncludes,
			data.tierImage,
			data.tierURLName,
		],
	);
	return dbResults.rowsAffected > 0;
}

async function updateTier(data: any) {
	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE tiers SET tierName = ?, tierPriceUSD = ?, tierIncludes = ?, tierImage = ?, tierURLName = ? WHERE id = ?",
		true,
		[
			data.tierName,
			data.tierPriceUSD,
			data.tierIncludes,
			data.tierImage,
			data.tierURLName,
			data.id,
		],
	);
	return dbResults.rowsAffected > 0;
}

async function deleteTier(data: any) {
	const dbResults: ResultSet = await runSQL(
		true,
		"DELETE FROM tiers WHERE id = ?",
		true,
		[data.id],
	);
	return dbResults.rowsAffected > 0;
}

export { getTiers, getTier, addTier, updateTier, deleteTier };
