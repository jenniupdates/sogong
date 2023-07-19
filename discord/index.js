import dotenv from 'dotenv';
dotenv.config()
import { Client, GatewayIntentBits, GatewayVersion, bold, italic, underscore, inlineCode } from 'discord.js';
// import { SlashCommandBuilder } from '@discordjs/builders';
import * as Mastermind from "./mastermind.cjs";
import * as Commands from './commands.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
})

let dict = {};

client.login(process.env.TOKEN);

client.on('ready', async (client) => {
    try {
      await Commands.register(client);
      console.log(`✅ ${client.user.tag} aka ${client.user.username} is online !!!`);
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
});


client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "start") {
        interaction.reply(`${bold("Game is starting...")}\n\n- 🟢 means that the number is in the right place \n- ⚠️ means that the number exists but in the wrong place \n- ❌ means that the number does not exist at all \n- Do note that \'0\' can also be one of the digits \n\n Use command ${inlineCode("/input <number>")} to test a number`);
        // userid: [generatedNumber, numTurns]
        dict[interaction.user.id] = [Mastermind.generateRandomNumber(),0];
        console.log(`Generated number for ID ${interaction.user.id}: `, dict[interaction.user.id][0]);
    }

    if (interaction.commandName === "input") {
        if (interaction.user.id in dict) {
            let userInput = interaction.options.get('input-number');
            dict[interaction.user.id][1] += 1
            console.log(`Generated number for ID ${interaction.user.id}: ${dict[interaction.user.id][0]}, User input: ${userInput.value}`)
            let result = Mastermind.checkAnswer(userInput.value, dict[interaction.user.id][0]);
            if (result["🟢"] == 3) {
                interaction.reply(`${bold(`Turn #${dict[interaction.user.id][1]}`)}\n Your input is: ${underscore(userInput.value)}\n ${JSON.stringify(result)}\n\n ${bold("YOU WIN!")}\n Game has ended, you can start another using ${inlineCode("/start")}`);
                dict = {};
            }
            else {
                interaction.reply(`${bold(`Turn #${dict[interaction.user.id][1]}`)}\n Your input is: ${underscore(userInput.value)}\n ${JSON.stringify(result)}\n\n ${bold("WRONG...")} Try Again...`);
            }

        } else {
            interaction.reply("You have yet to start the game, please use the command \`/start\`")
        }
    }
})


// use this function to find out guildid and other details
// client.on("messageCreate", async (message) => {
//     console.log("Content: ", message.content);
//     let msg = {};
//     msg.id = message.id;
//     msg.guildid = message.guildId;
//     msg.content = message.content;
//     msg.creator = message.author.id;
//     console.log(msg);

//     if (!message?.author.bot) {
//         // message.author.send(`Echo ${msg.content}`);
//         message.reply(`Echo ${msg.content}`)
//     }
// }); 


// Create a slash command builder
// const startGame = new SlashCommandBuilder()
//                     .setName('startSogong')
//                     .setDescription('start Sogong Mastermind Game')
//                     .addStringOption(option => option.setName('Yes')
                                                    //  .setDescription('GAME START!!!'));
                                                     
// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	if (interaction.commandName === 'ping') {
// 		await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
// 	}
// });