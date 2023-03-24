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
        console.log(command)
        const commandFile = await import(`#commands/${command}`);
        commandsArray.push(commandFile.create());
    }

    try {
        console.log(1)
        const test = await client.application.commands.set(commandsArray);
        console.log(test)
    } catch (e) {
        console.log(e)
    }

    console.log(`Successfully logged in as ${client.user.tag}!`);
}

export { once, name, invoke };