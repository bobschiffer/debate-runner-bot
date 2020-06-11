module.exports = {
  name: "hear",
  description: "Makes hear hear sound",
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
    console.log(state.connection);
    state.connection.play("../audio/hear.mp3");
    message.channel.send(`**@${message.author.username} says:** *HEAR, HEAR!*`);
  }
};
