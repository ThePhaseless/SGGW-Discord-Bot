import { Interaction, SlashCommandBuilder } from "discord.js";

const _slashCommand = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!");

async function _execute(interaction: Interaction) {
	if (!interaction.isCommand()) {
		return;
	}

	await interaction.reply("Pong!");
}
const ping = {
	data: _slashCommand,
	execute: _execute,
};

export { ping };