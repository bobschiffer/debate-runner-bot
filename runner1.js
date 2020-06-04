// Initial config
const Discord = require("discord.js");
const prefix = "-";
const client = new Discord.Client();
const runner = "runner1";

// States
let connection;
let voiceChannel;
let inVoice = false;
let motionBox;
let isTiming = false;

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
  } else if (
    message.member.voice.channel &&
    message.member.voice.channel.name === voiceChannel
  ) {
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
        message.channel.send(
          `POI from @${
            args.length === 0
              ? message.author.username
              : message.author.username + " of " + args.join(" ")
          }!`
        );
      }
    } else if (command === "speech" && !isTiming) {
      isTiming = true;
      message.channel.send(
        `${
          args.length > 0 ? args.join(" ") + " speech" : "Next speech"
        } has started.`
      );
      timer(1, 0, message.channel, 1, "*1 minute!*");
      for (let i = 2; i <= 5; i++)
        timer(i, 0, message.channel, 0, `*${i} minutes!*`);
      timer(6, 0, message.channel, 1, "*6 minutes!*");
      timer(7, 0, message.channel, 2, "*7 minutes! Time!*").then(
        () => (isTiming = false)
      );
    } else if (command === "leave") {
      /**LEAVE */
      message.channel.send(Runner + " has disconnected.");
      connection.disconnect();
      inVoice = false;
    }
  } else if (command === "prep" && !isTiming) {
    /**TIMER */
    isTiming = true;
    message.channel.send("Round starts in 15 minutes!");
    timer(15, 0, message.channel, 0, "@everyone: Prep time's over!").then(
      () => (isTiming = false)
    );
  } else if (command === "set-motion") {
    /* Motion */
    const motion = args.join(" ");
    console.log("Someone set the motion to", motion);
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

/** TO-DO: TIMER */
// Converts minutes and seconds into milliseconds
const toMilli = (min, sec) => {
  let milli = 0;
  milli += min * 60000;
  milli += sec * 1000;
  return milli;
};

const timer = (m, s, channel, numBells, message) => {
  let time = toMilli(m, s);
  setTimeout(() => {
    channel.send(message);
    if (connection) {
      for (let i = 0; i < numBells; i++) connection.play("./bell.mp3");
    }
  }, time);
  return new Promise(resolve => setTimeout(resolve, time));
};

client.login(process.env.BOT_TOKEN);
