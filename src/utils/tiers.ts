import { ResultSet } from "@libsql/client";
import { runSQL } from "./database";
import { parseTiers, Tier } from "./types";

async function getTiers(): Promise<Tier[] | null> {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM tiers", false);
	if (dbResults.rows.length === 0) {
		console.log("No tiers found");
		return null;
	}
	return parseTiers(dbResults);
}

async function getTier(tierId: string): Promise<Tier | null> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM tiers WHERE id = ?",
		true,
		[tierId],
	);
	if (dbResults.rows.length === 0) {
		console.log("No tier found");
		return null;
	}
	return (await parseTiers(dbResults))[0];
}

async function addTier(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO tiers (tierName, tierPriceUSD, tierImage, tierURLName) VALUES (?, ?, ?, ?, ?)",
		true,
		[data.tierName, data.tierPriceUSD, data.tierImage, data.tierURLName],
	);
	return dbResults.rowsAffected > 0;
}

async function updateTier(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE tiers SET tierName = ?, tierPriceUSD = ?, tierImage = ?, tierURLName = ? WHERE id = ?",
		true,
		[data.tierName, data.tierPriceUSD, data.tierImage, data.tierURLName, data.id],
	);
	return dbResults.rowsAffected > 0;
}

async function deleteTier(data: any): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"DELETE FROM tiers WHERE id = ?",
		true,
		[data.id],
	);
	return dbResults.rowsAffected > 0;
}

export { getTiers, getTier, addTier, updateTier, deleteTier };
