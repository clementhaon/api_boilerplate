import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
	const command = new ContextMenuCommandBuilder()
        .setName('menu')
        .setType(ApplicationCommandType.User);

	return command.toJSON();
    
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {
	client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isUserContextMenuCommand()) return;
        console.log(interaction);
    });

	// Reply with a confirmation
	interaction.reply({
		content: `I deleted ${deletedMessages} messages for you!`,
		ephemeral: true,
	});
};

export { create, invoke };