const { MessageEmbed, WebhookClient } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const fetch = require("node-fetch");

const {
  getConfig,
  saveConfig,
  reloadConfig,
} = require("../handlers/configHandler");

let webhook = new WebhookClient({
  url: process.env.WEBHOOK,
});

let running = false;
let isCooldown = false;
let logTaskId, voiceTaskId;

module.exports = {
  role: true,

  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Control update-tasks, i guess lol")
    .addSubcommand((subcommand) =>
      subcommand.setName("start").setDescription("Start update-tasks")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("Stop update-tasks")
    ),
  async execute(interaction) {
    let options = interaction.options;

    switch (options.getSubcommand()) {
      case "start":
        if (isCooldown) {
          return await interaction.reply(
            "❌` Please wait 5 minutes and try again! Cooldown-ing.... `"
          );
        }

        if (running) {
          return interaction.reply("❌` Update-Tasks are already running! `");
        }

        running = true;
        isCooldown = true;

        updateLogEmbed(interaction);

        logTaskId = setInterval(
          () => updateLogEmbed(interaction),
          getConfig().text.duration * 1000
        );
        /*
        voiceTaskId = setInterval(() => {
          updateVoiceText(interaction);
        }, getConfig().vcNameUpdateTime * 1000);
        */

        await interaction.reply("✅` Started Update-Tasks `");
        setTimeout(() => (isCooldown = false), 300 * 1000);
        break;

      case "stop":
        if (!running) {
          return interaction.reply("❌` Update-Tasks ain't running `");
        }

        running = false;

        clearInterval(logTaskId);
        clearInterval(voiceTaskId);

        await interaction.reply("✅` Stopped Update-Tasks `");
        break;
    }
  },
};

/*

  Functions

*/

async function updateVoiceText(interaction) {
  if (!getConfig().customVCName) {
    let channel = await interaction.guild.channels.fetch(
      getConfig().voiceChannelId
    );
    let url2 = `https://mcsrv.vercel.app/?ip=${
      getConfig().serverIp
    }&port=25565`;

    let text;

    try {
      let data = await fetch(url2).then((response) => response.json());
      text = `🟩 Online (${data.onlinePlayers}/${data.maxPlayers})`;
    } catch (error) {
      text = "🟥 Offline";
    }

    channel.setName(text);
  }
}
/* 

  Update Log Function

*/

async function updateLogEmbed(interaction) {
  const config = getConfig();
  const embed = new MessageEmbed();
  const url = `https://mcsrv.vercel.app/?ip=${config.server}&port=25565`;

  const textchannel = await interaction.client.channels.fetch(config.text.id);

  await textchannel.messages
    .fetch(config.messageId)
    .catch(() => (config.text.messageId = ""));

  if (config.text.messageId == "") {
    textchannel
      .send({ embeds: [new MessageEmbed().setDescription(":)")] })
      .then((send) => {
        config.text.messageId = send.id;
        saveConfig();
        reloadConfig();
      });
    console.log("aaaaaaaaaa");
  }

  embed.setAuthor({
    name: config.server.toUpperCase(),
  });

  embed.setTimestamp();

  try {
    const data = await fetch(url).then((response) => response.json());
    embed.setThumbnail(`${url}&favicon=1`);
    embed.setColor("AQUA");

    embed.setDescription(
      data.description.descriptionText.replace(/§[a-z0-9]/g, "")
    );

    embed.addField("Server Status", "Online", false);
    embed.addField("Online", `${data.onlinePlayers}/${data.maxPlayers}`, true);
    embed.addField("Software / Version", data.version, false);
  } catch (error) {
    embed.addField("Status", "Offline", false);
  }

  const message = await textchannel.messages.fetch(config.text.messageId);
  message.edit({ embeds: [embed] });
}
