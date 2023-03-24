import { SlashCommandBuilder } from 'discord.js';

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    console.log('create ping');
	const command = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replys with Pong!');

	return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
	const user = interaction.options.getUser('user');

	if (user !== null) interaction.reply({ content: `Hello ${user}!` });
	else
		interaction.reply({
			content: 'Pong!',
			ephemeral: true,
		});
};

export { create, invoke };