const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = "-";

// States
const state = {
  runner: "runner1",
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

if (process.env.NODE_ENV === "production") client.login(process.env.BOT_TOKEN);
else client.login(require("./config.js").token);
