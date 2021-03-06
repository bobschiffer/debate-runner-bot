module.exports = {
  name: "timer",
  description: "times and makes the bell sound for a number of times",
  time(m, s, numBells, state, channel, message) {
    // Convert to milliseconds for setTimeout()
    let time = 0;
    time += m * 60000;
    time += s * 1000;

    let id = setTimeout(() => {
      channel.send(message);
      if (state.connection) {
        for (let i = 0; i < numBells; i++)
          state.connection.play("./audio/bell.mp3");
      }
    }, time);

    // Store setTimeout for clearing with -reset
    state.timers.push(id);

    return new Promise(resolve => setTimeout(resolve, time));
  }
};
