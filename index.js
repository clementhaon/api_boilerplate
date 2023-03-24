import dotenv from 'dotenv'
dotenv.config({ silent: true });
import http from 'http';
import middlewares from './app/core/middlewares.js';
import express from 'express';
import cors from 'cors';
import Router from './models/router.js';
import { Client, GatewayIntentBits } from 'discord.js';
import fs from "node:fs";
import { sendMessageAfterConnection } from './discord/connection.js';
import * as path from "path";

const PORT = process.env.port || 5000;
const token = process.env.DISCORD_TOKEN;


const app = express();

app.use('*', cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(middlewares.cors);
app.use('/', Router);


const httpServer = http.createServer(app);
httpServer.listen(PORT, () => 
    console.log(`http server listening on port ${PORT}`)
);


app.get("/test", (req, res) => {
    res.status(200).send('Hello World');
});

try {
    console.log('laaa')
    // Create a new client instance
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
    client.on('ready', async () => {
        console.log(`Ready! Logged in as `);
        sendMessageAfterConnection(client);

    });

    // Fetch all js files in ./events
    const events = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'));

    console.log(events)
// Check for an event and execute the corresponding file in ./events
    for (let event of events) {
        console.log(event)
        // The #events ES6 import-abbreviation is defined in the package.json
        // Note that the entries in the list of files (created by readdirSync) end with .js,
        // so the abbreviation is different to the #commands abbreviation
        const eventFile = await import(`#events/${event}`);
        console.log(eventFile)
        // But first check if it's an event emitted once
        if (eventFile.once)
            client.once(eventFile.name, (...args) => {
                eventFile.invoke(...args);
            });
        else
            client.on(eventFile.name, (...args) => {
                eventFile.invoke(...args);
            });
    }
    client.login(token);

}catch (e) {
    console.log(e)
}
