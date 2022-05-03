const { MessageEmbed, WebhookClient } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
var {
  getConfig,
  saveConfig,
  reloadConfig,
} = require("../handlers/configHandler");
module.exports = {
  role: true,
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("View config")
    /*
      /config serverip
    */
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Change server")
        .addStringOption((option) =>
          option.setName("server").setDescription("Minecraft Server Ip")
        )
    )
    /*
      /config voicechannelid
    */
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("text")
        .setDescription("a")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("id")
            .setDescription("a")
            .addStringOption((option) =>
              option.setName("id").setDescription("a")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("duration")
            .setDescription("a")
            .addIntegerOption((option) =>
              option.setName("seconds").setDescription("a").setMinValue(120)
            )
        )
    )
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("voice")
        .setDescription("a")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("id")
            .setDescription("a")
            .addStringOption((option) =>
              option.setName("id").setDescription("a")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("duration")
            .setDescription("a")
            .addIntegerOption((option) =>
              option.setName("seconds").setDescription("a").setMinValue(350)
            )
        )
    )

    /*
      /config view
    */
    .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("View the config")
    ),

  async execute(interaction) {
    let config = getConfig();
    let options = interaction.options;

    const embed = new MessageEmbed().setColor("GREEN").setTitle("Config");

    switch (options.getSubcommand(false)) {
      case "view":
        embed.setDescription(
          `
          server: [${config.server}]

          text:
          > id: [${config.text.id}]
          > messageId: [${config.text.messageId}]
          > duration: [${config.text.duration}s]

          voice:
          > id: [${config.voice.id}]
          > duration: [${config.voice.duration}s] 
          > custom: [${config.voice.custom}]
          `
        );
        break;
      case "server":
        var server = options.getString("server", true);
        config.server = server;

        embed.setDescription(
          `:white_check_mark: Changed **server** to **${server}**`
        );

        break;

      case "id":
        var id = options.getString("id");
        if (options.getSubcommandGroup() == "text") {
          config.text.id = id;

          embed.setDescription(
            `:white_check_mark: Changed **text.id** to **${id}**`
          );
        } else if (options.getSubcommandGroup() == "voice") {
          config.voice.id = id;

          embed.setDescription(
            `:white_check_mark: Changed **voice.id** to **${id}**`
          );
        }
        break;
      case "duration":
        var sec = options.getInteger("seconds");
        if (options.getSubcommandGroup() == "text") {
          config.text.duration = sec;

          embed.setDescription(
            `:white_check_mark: Changed **text.duration** to **${sec}** seconds`
          );
        } else if (options.getSubcommandGroup() == "voice") {
          config.voice.duration = sec;

          embed.setDescription(
            `:white_check_mark: Changed **voice.duration** to **${sec}** seconds`
          );
        }
        break;
    }

    saveConfig();
    reloadConfig();
    await interaction.reply({ embeds: [embed] });
  },
};
