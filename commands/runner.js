module.exports = {
  name: "runner1",
  description: "Invites this Runner bot to voice chat",
  async execute(state, message, args) {
    // Bot must not be already in a voice channel
    if (state.connection) {
      message.channel.reply("But this bot is already in a voice channel...");
      return;
    }

    // Sender must be part of a voice channel
    if (!message.member.voice.channel) {
      message.channel.reply("You have to join a voice channel first!");
      return;
    }

    // Execute
    state.voiceChannel = message.member.voice.channel.name;
    state.connection = await message.member.voice.channel.join();
  }
};
