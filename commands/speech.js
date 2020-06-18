module.exports = {
  name: "speech",
  description: "Time a debate speech",
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

    // 8 minutes for Australs, 7 minutes for BP
    let mins = state.format === "Australs" ? 8 : 7;

    message.channel.send(
      `${
        args.length > 0 ? args.join(" ") + " speech" : "Next speech"
      } has started.`
    );
    state.connection.play("./audio/hear.mp3");
    timer
      .time(1, 0, 1, state, message.channel, "*1 minute!*")
      .then(() => (state.protectedTime = false));
    for (let i = 2; i <= mins - 2; i++)
      timer.time(i, 0, 0, state, message.channel, `*${mins} minutes!*`);
    timer
      .time(mins - 1, 0, 1, state, message.channel, `*${mins - 1} minutes!*`)
      .then(() => (state.protectedTime = true));
    timer
      .time(mins, 0, 2, state, message.channel, `*${mins} minutes! Time!*`)
      .then(() => {
        state.isTiming = false;
        state.protectedTime = false;
      });
  }
};
