// Global Variables and Client Building
const { Client, Collection } = require('discord.js');
const { Intents } = require('discord-fast-intents');
const fs = require('fs'); const path = require('path');
global.config = require('./config.json');
global.builders = require('@discordjs/builders')
global.client = new Client({ intents: new Intents(), ws: { properties: { $browser: "Discord iOS" }}});
global.utils = require('./utils.js');

client.login(process.env.TOKEN || config.token)
process.on('SIGINT', async () => { client.destroy() });

// COMMAND HANDLING
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// EVENTS
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(path.join(__dirname, 'events', file));
	client.on(event.name, async (...args) => event.run(...args)) 
}