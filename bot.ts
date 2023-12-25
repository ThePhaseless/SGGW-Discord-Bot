import { ChannelType, Client, Events, GatewayIntentBits } from "discord.js";
import { triggerOnMessage } from "./lib/functions";
import { BOT_TOKEN, OWNER_ID } from "./lib/consts";
import { commands } from "./lib/command_list";


const log = console;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
});

log.info("Starting bot...");

client.once(Events.ClientReady, async readyClient => {

	// Cache the DM channel with the ownerw
	readyClient.users.fetch(OWNER_ID)
		?.then(user => user.createDM()
			.then(dmChannel => client.channels.cache.set(dmChannel.id, dmChannel)));

	readyClient.application?.commands.set([]);
	readyClient.application?.guild?.commands.set([]);
	for (const command of commands) {
		await client.application?.commands.create(command.data)
			.catch(error => {
				log.error(error);
			})
			.finally(() => {
				log.info(`Created command ${command.data.name}`);
			});
	}

	log.info(`Ready! Logged in as ${readyClient.user.tag}`);

});

client.on(Events.Error, error => {
	log.error(error);
});

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
	if (newMessage.author === null || newMessage.content === null) {
		return;
	}
	if (newMessage.channel.type === ChannelType.DM) {
		log.info(`DM from ${newMessage.author.tag} changed from ${oldMessage.content} to ${newMessage.content}`);
		return;
	}

	if (newMessage.partial) {
		newMessage.fetch().then(message => {
			triggerOnMessage(message);
		});
		return;
	}
});

client.on(Events.MessageCreate, (message) => {
	triggerOnMessage(message);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) {
		return;
	}
	const command = commands.find(command => command.data.name === interaction.commandName);
	if (!command) {
		return;
	}

	await command.execute(interaction).
		catch(error => {
			log.error(error);
			interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		});
});

client.login(BOT_TOKEN);

export { log, client };
