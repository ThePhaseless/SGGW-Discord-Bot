import { SlashCommandBuilder, Interaction, GuildMember, PermissionFlagsBits } from "discord.js";
import { changeNickname } from "../lib/functions";
const _slashCommand = new SlashCommandBuilder()
	.setName("add-name")
	.setDescription("Adds a name to the user's nickname")
	.addStringOption(option => option.setName("name")
		.setDescription("The name to add to the user's nickname").setRequired(true))
	.addUserOption(option => option.setName("user")
		.setDescription("The user to add the name to").setRequired(false));

async function _execute(interaction: Interaction) {
	if (!interaction.isCommand()) {
		return;
	}

	const name = interaction.options.get("name");
	let member = interaction.member;
	if (!(member instanceof GuildMember)) {
		await interaction.reply(
			{
				content: "Member is not a GuildMember!",
				ephemeral: true
			}
		);
		return;
	}
	if (interaction.options.getMember("user") !== null) {
		// Check if the user has the permission to add names to other users
		if (!member?.permissions.has(PermissionFlagsBits.ManageNicknames) && !member?.permissions.has(PermissionFlagsBits.Administrator)) {
			await interaction.reply(
				{
					content: "You don't have the permission to add names to other users!",
					ephemeral: true
				}
			);
			return;
		}
		member = (interaction.options.getMember("user") ?? member) as GuildMember;
	}

	if (!name || !member) {
		await interaction.reply(
			{
				content: "Could not find name or member!",
				ephemeral: true
			}
		);
		return;
	}
	if (!(member instanceof GuildMember)) {
		await interaction.reply(
			{
				content: "Member is not a GuildMember!",
				ephemeral: true
			}
		);
		return;
	}

	await changeNickname(member, name.value as string ?? "").catch(error => {
		interaction.reply({
			content: `There was an error while changing the nickname: ${error}`,
			ephemeral: true
		});
		return;
	});

	interaction.reply({
		content: `Adding name ${name.value} to ${member}`,
		ephemeral: true
	});
}

const change_name = {
	data: _slashCommand,
	execute: _execute
};

export { change_name };