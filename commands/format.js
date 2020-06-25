module.exports = {
  name: "format",
  description:
    "Sets a motion then starts a prep timer -- exclusive for runner1",
  execute(state, message, args) {
    const Discord = require("discord.js");
    const timer = require("./timer.js");

    // There has to be a format as an argument
    if (args.length < 1) {
      message.channel.send(
        "Imprope format. Must follow example: `-format Australs` or `-format BP`."
      );
      return;
    }

    // Change format
    state.format = args.join(" ");
    console.log(`Format set to ${state.format}`);
  }
};
