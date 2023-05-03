const Discord = require('discord.js');
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ComponentType } = Discord;
const TextInputStyles = Discord.ApplicationCommandOptionType;

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('menu')
		.setDescription('Open a modal to fill');

	return command.toJSON();
};

const invoke = async (interaction) => {
	const modal = new ModalBuilder()
		.setTitle('Fill the fields')
		.setCustomId('my-modal-id');

	const firstTextInput = new TextInputBuilder()
		.setCustomId('first-text-input')
		.setPlaceholder('Enter first text here')
		.setMaxLength(50)
		.setMinLength(5)
		.setLabel('First Text Input')
		.setStyle(TextInputStyles.SHORT);

	const secondTextInput = new TextInputBuilder()
		.setCustomId('second-text-input')
		.setPlaceholder('Enter second text here')
		.setMaxLength(200)
		.setMinLength(5)
		.setLabel('Second Text Input')
		.setStyle(TextInputStyles.LONG);

	const firstActionRow = new ModalActionRowBuilder()
		.addComponents(firstTextInput)
		.setCustomId('first-action-row');

	const secondActionRow = new ModalActionRowBuilder()
		.addComponents(secondTextInput)
		.setCustomId('second-action-row');

	modal.addComponents(firstActionRow, secondActionRow);

	await interaction.reply({
		content: 'Opening modal ...',
		ephemeral: true,
		components: modal,
	});
};

export { create, invoke };
