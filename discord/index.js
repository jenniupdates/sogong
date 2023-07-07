import dotenv from 'dotenv';
dotenv.config()
import { Client, GatewayIntentBits, GatewayVersion } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
})

const dict = {};

client.login(process.env.TOKEN);

client.on("ready", (client) => {
    console.log(`${client.user.tag} aka ${client.user.username} is online !!!`);
})

client.on("messageCreate", async (message) => {
    console.log("Content: ", message.content);
    let msg = {};
    msg.id = message.id;
    msg.content = message.content;
    msg.creator = message.author.id;
    console.log(msg);

    // if (!message?.author.bot) {
    //     message.author.send(`Echo ${message.content}`);
    // }
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