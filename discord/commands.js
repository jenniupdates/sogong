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

// const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

// to register slash commands for a specific server only
// (async () => {
//     try {
//         console.log("Registering slash commands...");
//         await rest.put(
//             Routes.applicationCommands(
//                 process.env.CLIENT_ID, 
//                 // process.env.GUILD_ID
//             ), { body: commands }
//         )
//         console.log("Slash commands regsitered successfully");
//     } catch (error) {
//         console.log(`There was an error registering slash commands: ${error}`);
//     }
// })();

// to register slash commands for both DM and server
export async function register(client) {
    try {
        console.log('Registering slash commands...');
        await client.application?.commands.set(commands);
        console.log('Slash commands registered successfully');
    } catch (error) {
        console.log(`There was an error registering slash commands: ${error}`);
        console.log('Re-using the last state of successfully set commands...');
    }
}
