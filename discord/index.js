import dotenv from 'dotenv';
dotenv.config()
import { Client, GatewayIntentBits, GatewayVersion } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as Mastermind from "./mastermind.cjs";

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

client.on("ready", (client) => {
    console.log(`✅ ${client.user.tag} aka ${client.user.username} is online !!!`);
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "start") {
        interaction.reply("Starting game...\n- 🟢 means that the number is in the right place \n- ⚠️ means that the number exists but in the wrong place \n- ❌ means that the number does not exist at all \n Use command \`/input <number>\` to test a number");
        dict[interaction.user.id] = [Mastermind.generateRandomNumber(),0];
        console.log("Generated number: ", dict[interaction.user.id][0]);
    }

    if (interaction.commandName === "input") {
        if (interaction.user.id in dict) {
            let userInput = interaction.options.get('input-number');
            dict[interaction.user.id][1] += 1
            console.log(`Generated number: ${dict[interaction.user.id]}, User input: ${userInput.value}`)
            let result = Mastermind.checkAnswer(userInput.value, dict[interaction.user.id]);
            if (result["🟢"] == 3) {
                interaction.reply(`Turn ${dict[interaction.user.id][1]}: Your input is: ${userInput.value}\n ${JSON.stringify(result)}\n YOU WIN, GAME ENDS. YOU CAN START ANOTHER VIA COMMAND \`/start\``);
                dict = {};
            }
            else {
                interaction.reply(`Your input is: ${userInput.value}\n ${JSON.stringify(result)}\n Wrong... Try Again...`);
            }

        } else {
            interaction.reply("You have yet to start the game, please use the command \`/start\`")
        }
    }
})

client.on("messageCreate", async (message) => {
    console.log("Content: ", message.content);
    let msg = {};
    msg.id = message.id;
    msg.guildid = message.guildId;
    msg.content = message.content;
    msg.creator = message.author.id;
    console.log(msg);

    if (!message?.author.bot) {
        // message.author.send(`Echo ${msg.content}`);
        message.reply(`Echo ${msg.content}`)
    }
}); 

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