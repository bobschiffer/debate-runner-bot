module.exports = {
  name: "exit",
  description: "Bot leaves voice channel",
  execute(state, message, args) {
    if (state.connection) {
      message.channel.send(state.runner + " has disconnected from " + state.voiceChannel);
      state.connection.disconnect();
    }
  }
};
