module.exports = {
  name: "restart",
  description: "Restarts timer",
  execute(state, message, args) {
    state.timers.forEach(id => clearTimeout(id));
    message.channel.send("Timer stopped.");
  }
};
