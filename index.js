require("dotenv").config();

const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

/*
  Client ready event
*/

client.once("ready", () => {
  console.log("┌─────────────────── < READY > ───────────────────┐");
  console.log(`  Bot Name: (${client.user.username})`);
  console.log(`  Bot Id: (${client.user.id})`);
  console.log(`  Guild Name (${client.guilds.cache.at(0)})`);
  console.log(`  Guild Id (${client.guilds.cache.at(0).id}`);
  console.log(`└─────────────────────────────────────────────────┘`);
});

client.on("messageCreate", async (message) => {
  let isA = false;
  if (message.author.id == "686166581465972742") {
    let finalmes = "";
    for (let i = 0; i < message.content.length; i++) {
      if (!isA) {
        finalmes += message.content.charAt(i).toLowerCase();
        isA = true;
      } else {
        finalmes += message.content.charAt(i).toUpperCase();
        isA = false;
      }
    }
    message.channel.send(finalmes);
  }
});

/*
  On interactionCreate event

client.on("interactionCreate", async (interaction) => {
  // if (!interaction.member.roles.cache.has(process.env.ROLE_ID)) return;
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  if (command.role) {
    if (!interaction.member.roles.cache.has(process.env.ROLE_ID)) return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌` There was an error while executing this command! `",
      ephemeral: true,
    });
  }
});
*/
client.login(process.env.BOT_TOKEN);
