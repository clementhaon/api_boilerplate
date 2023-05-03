import fs from 'fs';

const once = true;
const name = 'ready';

async function invoke(client) {
	const commands = fs
		.readdirSync('./events/commands')
		.filter((file) => file.endsWith('.js'))
		.map((file) => file.slice(0, -3));

	const commandsArray = [];

	for (let command of commands) {
		const commandFile = await import(`#commands/${command}`);
		console.log(commandFile.create())
		commandsArray.push(commandFile.create());
	}

	const adddCommand = await client.application.commands.set(commandsArray);

	console.log(adddCommand)

	console.log(`Successfully logged in as ${client.user.tag}!`);
}

export { once, name, invoke };