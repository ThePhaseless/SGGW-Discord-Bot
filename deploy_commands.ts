import { REST, Routes } from "discord.js";
import { BOT_TOKEN, CLIENT_ID } from "./lib/consts";
import { commands } from "./lib/command_list";

const rest = new REST().setToken(BOT_TOKEN);
const log = console;

log.info("Refreshing commands...");
try {
	const commandsJson = commands.map(command => command.data.toJSON());
	log.info(commandsJson);
	for (const command of commandsJson) {
		log.info(`Creating command ${command.name}`);
		await rest.post(
			Routes.applicationCommands(CLIENT_ID),
			{ body: command },
		);
	}
	log.info("Commands refreshed!");
}
catch (error) {
	log.error(error);
}