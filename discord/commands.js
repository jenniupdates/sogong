import dotenv from 'dotenv';
dotenv.config()

import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';

const commands = [
    {
        name: 'start',
        description: "Start Sogong Mastermind Game",
    },
    {
        name: 'input',
        description: "Mastermind Game User Input",
        options: [
            {
                name: "input-number",
                description: "the input number", 
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID
            ), { body: commands }
        )
        console.log("Slash commands regsitered successfully");
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();