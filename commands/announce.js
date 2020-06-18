module.exports = {
  name: "announce",
  description:
    "Sets a motion then starts a 15-minute timer -- exclusive for runner1",
  execute(state, message, args) {
    const Discord = require("discord.js");
    const timer = require("./timer.js");
    let mins = state.format === "Australs" ? 30 : 15;

    // There has to be a motion as an argument
    if (args.length < 1) {
      message.channel.send(
        "No motion entered. Type `-announce <motion>`. e.g. `-announce THW ban guns`"
      );
      return;
    }

    // Convert arrayed arguments into a string for the motion
    const motion = args.join(" ");
    console.log(`Motion set to ${motion}`);

    // Create motion box
    const infoslide = motion.split("|")[1];
    state.motionBox = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setDescription(
        `**Motion**: ${
          infoslide ? motion.split("|")[0] : motion
        }\n\n**Infoslide:** ${infoslide ? infoslide : "None"}`
      )
      .setTimestamp();

    // Announce
//    message.channel.send("@everyone: Motion!");
    message.channel.send(state.motionBox);
  //  message.channel.send(`Round starts in ${mins} minutes.`);

    // Timer: bell rings twice after
    //timer.time(mins, 0, 2, state, message.channel, "@everyone: Time!!");
  }
};
