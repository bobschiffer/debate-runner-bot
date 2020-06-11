module.exports = {
  name: "poi",
  description: "Makes the poi sound",
  execute(state, message, args) {
    // Bot has to be in a voice channel
    if (!state.connection) {
      return;
    }

    // Sender has to be in a voice channel
    if (!message.member.voice.channel) {
      message.channel.send(`Join a voice channel first!`);
      return;
    }

    // Bot and sender have to be in the same VC
    if (message.member.voice.channel.name !== state.voiceChannel) {
      console.log(
        `From ${state.runner}: Someone possible executed a command for the other bot. This is just a log.`
      );
      return;
    }

    // Execute
    state.connection.play("./audio/point.mp3");
    message.channel.send(
      `POI from @${
        args.length === 0
          ? message.author.username
          : message.author.username + " of " + args.join(" ")
      }!`
    );
  }
};
