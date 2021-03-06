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
    if (!voiceChannel) {
      message.channel.send(
        `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
      );
      return;
    }
    if (connection && inVoice) {
      connection.play("./hear.mp3");
      message.channel.send(
        `**@${message.author.username} says:** *HEAR, HEAR!*`
      );
    }
  } else if (command === "shame") {
    if (!voiceChannel) {
      message.channel.send(
        `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
      );
      return;
    }
    if (connection && inVoice) {
      connection.play("./shame.mp3");
      message.channel.send(`**@${message.author.username} says:** *SHAME!*`);
    }
  } else if (command === "point" || command === "poi") {
    if (!voiceChannel) {
      message.channel.send(
        `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
      );
      return;
    }
    if (protectedTime) {
      message.channel.send("Out of order.");
      return;
    }
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
  } else if (command === "speech") {
    if (!voiceChannel) {
      message.channel.send(
        `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
      );
      return;
    }
    if (isTiming) {
      message.channel.send(
        "Wait for current timer to finish or type `-reset` to stop it."
      );
      return;
    }
    isTiming = true;
    protectedTime = true;
    message.channel.send(
      `${
        args.length > 0 ? args.join(" ") + " speech" : "Next speech"
      } has started.`
    );
    connection.play("./hear.mp3");
    timer(1, 0, message.channel, 1, "*1 minute!*").then(
      () => (protectedTime = false)
    );
    for (let i = 2; i <= 5; i++)
      timer(i, 0, message.channel, 0, `*${i} minutes!*`);
    timer(6, 0, message.channel, 1, "*6 minutes!*").then(
      () => (protectedTime = true)
    );
    timer(7, 0, message.channel, 2, "*7 minutes! Time!*").then(() => {
      isTiming = false;
      protectedTime = false;
    });
  } else if (command === "exit" && inVoice && connection) {
    /**LEAVE */
    message.channel.send(runner + " has disconnected from " + voiceChannel);
    connection.disconnect();
    inVoice = false;
  }
}

if (command === "prep") {
  if (isTiming) {
    message.channel.send("Wait for current timer to finish!");
    return;
  }
  isTiming = true;
  message.channel.send("Round starts in 15 minutes!");
  timer(15, 0, message.channel, 0, "@everyone: Prep time's over!").then(
    () => (isTiming = false)
  );
}

if (command === "reset") {
  timers.forEach(id => clearTimeout(id));
  message.channel.send("Timer stopped.");
}

if (command === "announce" || command === "set-motion") {
  /* Motion */
  if (args.length < 1) {
    message.channel.send(
      "No motion entered. Type `-announce <motion>`. e.g. `-announce THW ban guns`"
    );
    return;
  }
  const motion = args.join(" ");
  console.log(
    "Someone set the motion to " + motion + " from " + message.channel.name
  );
  const infoslide = motion.split("|")[1];
  motionBox = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setDescription(
      `**Motion**: ${
        infoslide ? motion.split("|")[0] : motion
      }\n\n**Infoslide:** ${infoslide ? infoslide : "None"}`
    )
    .setTimestamp();
  message.channel.send("@everyone, motion!");
  message.channel.send(motionBox);

  if (!isTiming) {
    isTiming = true;
    message.channel.send("Round starts in 15 minutes!");
    timer(15, 0, message.channel, 0, "@everyone: Prep time's over!").then(
      () => (isTiming = false)
    );
  }
}

if (command === "motion") {
  if (motionBox) {
    message.channel.send(motionBox);
  } else {
    message.channel.send("Motion is empty!");
  }
}

if (message.member.voice.channel.name !== voiceChannel) {
  console.log(
    `Someone entered a command that ${runner} has. It's possible that it was meant for another runner. This is just a console log.`
  );
}
