// Initial config
const Discord = require("discord.js");
const prefix = "-";
const token = "NzE0Mzg5MjA4MDE3NTM1MDAw.XtDXuQ.F5691nPdU8DypdTzVcwCfFjUin4";
const client = new Discord.Client();

// States
const runner = "runner2";
let connection;
let voiceChannel;
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

  if (command === runner) {
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
  } else if (message.member.voice.channel.name === voiceChannel) {
    if (command === "hear") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./hear.mp3");
        message.channel.send(
          `**@${message.author.username} says:** *HEAR, HEAR!*`
        );
      }
    } else if (command === "shame") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./shame.mp3");
        message.channel.send(`**@${message.author.username} says:** *SHAME!*`);
      }
    } else if (command === "point" || command === "poi") {
      if (connection && inVoice) {
        const dispatcher = connection.play("./point.mp3");
        message.channel.send(`POI from @${message.author.username}!`);
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
  } else if (!voiceChannel) {
    message.channel.send(
      `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
    );
  } else if (message.member.voice.channel.name !== voiceChannel) {
    console.log(
      `Someone entered a command that ${runner} has. It's possible that it was meant for another runner. This is just a console log.`
    );
  }
});

client.login(token);
