import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const GUILD_ID = process.env.GUILD_ID || "";
const CLIENT_ID = process.env.CLIENT_ID || "";
const CHANNEL_ID = "1149818259462439003";
const ROLE_ID = "1149823675764330588";
const OWNER_ID = "282188744696659969";


export {
	BOT_TOKEN,
	GUILD_ID,
	CHANNEL_ID,
	ROLE_ID,
	OWNER_ID,
	CLIENT_ID,
};
