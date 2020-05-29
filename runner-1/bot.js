// Initial config
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

// States
let connection;
let voiceChannel = message.member.voice.channel.name;
let inVoice = false;
let motionBox;

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  /* Command parser */
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "runner1") {
    /* Voice */
    if (message.member.voice.channel && !inVoice) {
      inVoice = true;
      voiceChannel = message.member.voice.channel.name;
      connection = await message.member.voice.channel.join();
    } else if (inVoice) {
      message.channel.send("But this bot is already in a voice channel...");
    } else {
      message.reply("You need to join a voice channel first!");
    }
  } else if (message.member.voice.channel === voiceChannel) {
    if (command === "hear") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./hear.mp3");
        message.channel.send(
          `**@${message.author.username} says:** *HEAR, HEAR!*`
        );
      } else {
        message.channel.send(
          "This bot isn't in a voice channel! Type `-runner1` to invite it in the voice channel you're in."
        );
      }
    } else if (command === "shame") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./shame.mp3");
        message.channel.send(`**@${message.author.username} says:** *SHAME!*`);
      } else {
        message.channel.send(
          "This bot isn't in a voice channel! Type `-runner1` to invite it in the voice channel you're in."
        );
      }
    } else if (command === "point" || command === "poi") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./point.mp3");
        message.channel.send(`POI from @${message.author.username}!`);
      } else {
        message.channel.send(
          "This bot isn't in a voice channel! Type and enter `-runner1` to invite it in the voice channel you're in."
        );
      }
    } else if (command === "leave") {
      message.channel.send("Runner 1 has disconnected.");
      connection.disconnect();
      inVoice = false;
    } else if (command === "set-motion") {
      /* Motion */
      const motion = args.join(" ");
      const infoslide = motion.split("|")[1];
      motionBox = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setDescription(
          `**Motion**: ${
            infoslide ? motion.split("|")[0] : motion
          }\n\n**Infoslide:** ${infoslide ? infoslide : "None"}`
        )
        .setTimestamp();
      message.channel.send(motionBox);
    } else if (command === "motion") {
      if (motionBox) {
        message.channel.send(motionBox);
      } else {
        message.channel.send("Motion is empty!");
      }
    }
  }
});

client.login(token);
