const fs = require("node:fs");

let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

module.exports = {
  getConfig() {
    return config;
  },
  saveConfig() {
    fs.writeFileSync("./config.json", JSON.stringify(config));
  },
  reloadConfig() {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  },
};
