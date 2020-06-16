module.exports = {
  name: "speech",
  description: "Time a 7-minute debate speech",
  execute(state, message, args) {
    // Format: timer.time(minutes, seconds, number of bell rings, state, channel, bot message)
    const timer = require("./timer.js");

    // Bot should be in a voice channel first
    if (!state.voiceChannel) {
      message.channel.send(
        `This bot isn't in a voice channel! Type \`-${runner}\` to invite it in the voice channel you're in.`
      );
      return;
    }

    // Bot should not be timing anything else
    if (state.isTiming) {
      message.channel.send(
        "Wait for current timer to finish or type `-reset` to stop it."
      );
      return;
    }

    state.isTiming = true;
    state.protectedTime = true; // First and last minutes

    message.channel.send(
      `${
        args.length > 0 ? args.join(" ") + " speech" : "Next speech"
      } has started.`
    );
    state.connection.play("./audio/hear.mp3");
    timer
      .time(1, 0, 1, state, message.channel, "*1 minute!*")
      .then(() => (state.protectedTime = false));
    for (let i = 2; i <= 6; i++)
      timer.time(i, 0, 0, state, message.channel, `*${i} minutes!*`);
    timer
      .time(7, 0, 1, state, message.channel, "*7 minutes!*")
      .then(() => (state.protectedTime = true));
    timer
      .time(8, 0, 2, state, message.channel, "*8 minutes! Time!*")
      .then(() => {
        state.isTiming = false;
        state.protectedTime = false;
      });
  }
};
