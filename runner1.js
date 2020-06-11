// Initial config
const Discord = require("discord.js");
const prefix = "-";
const client = new Discord.Client();
client.commands = new Discord.Collection();
const runner = "runner1";

// States
const state = {
  runner,
  connection: undefined,
  voiceChannel: "",
  motionBox: undefined,
  isTiming: false,
  protectedTime: false,
  timers: []
};

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Timer IDs
let timers = [];

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  /* Command parser */
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(state, message, args);
  } catch (error) {
    console.error(error);
  }
});

/** TO-DO: TIMER */
// Converts minutes and seconds into milliseconds
const toMilli = (min, sec) => {
  let milli = 0;
  milli += min * 60000;
  milli += sec * 1000;
  return milli;
};

const timer = (m, s, channel, numBells, message) => {
  let time = toMilli(m, s);
  let id = setTimeout(() => {
    channel.send(message);
    if (connection) {
      for (let i = 0; i < numBells; i++) connection.play("./bell.mp3");
    }
  }, time);
  timers.push(id);
  return new Promise(resolve => setTimeout(resolve, time));
};

client.login(process.env.BOT_TOKEN);
