module.exports = {
  name: "motion",
  description: "Sends the motion",
  execute(state, message, args) {
    if (state.motionBox) {
      message.channel.send(state.motionBox);
    } else {
      message.channel.send("Motion is empty!");
    }
  }
};
