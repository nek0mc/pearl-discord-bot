const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  getConfig,
  saveConfig,
  reloadConfig,
} = require("../handlers/configHandler");

let isCooldown = false;

module.exports = {
  role: true,
  data: new SlashCommandBuilder()
    .setName("voicename")
    .setDescription("aaaa")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Change the name of channel")
        .addStringOption((option) =>
          option.setName("name").setDescription("Channel name")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("off").setDescription("Turn off [customVCName]")
    ),
  async execute(interaction) {
    let options = interaction.options;
    /*
      commands
    */

    switch (options.getSubcommand()) {
      case "set":
        if (isCooldown) {
          return await interaction.reply(
            "❌` Please wait 10 minutes and try again! Cooldown-ing... `"
          );
        }

        let channel = await interaction.guild.channels.fetch(
          getConfig().voiceChannelId
        );
        let name = options.getString("name", true);

        getConfig().customVCName = true;
        saveConfig();
        reloadConfig();
        isCooldown = true;
        channel.setName(name);

        await interaction.reply(
          `✅\` Changed channel with id [${
            getConfig().voiceChannelId
          }] name to [${name}] \``
        );

        setTimeout(() => (isCooldown = false), 600 * 1000);
        break;

      case "off":
        if (!getConfig().customVCName) {
          return interaction.reply("❌` [customVCName] is false");
        }

        getConfig().customVCName = false;
        saveConfig();
        reloadConfig();
        await interaction.reply(`✅\` Turned off [customVCName] \``);
        break;
    }
  },
};
