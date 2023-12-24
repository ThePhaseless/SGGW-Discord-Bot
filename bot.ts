import { ActivityType, ChannelType, Client, GatewayIntentBits, GuildMember, Message } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const GUILD_ID = '1148257084698275840';
const CHANNEL_ID = '1149818259462439003';
const ROLE_ID = '1149823675764330588';

console.log('Starting bot...');

// function to change nickname
function changeNickname(guildMember: GuildMember, messageContent: string) {
  let ogNickname: string = guildMember.nickname as string;

  if (ogNickname === null) {
    // if the user doesn't have a nickname, use their username
    ogNickname = guildMember.user.username;
  }

  // retrieve original nickname if the user already has an initial
  if (ogNickname.includes('|')) {
    // nickname is everything before the first '|'
    ogNickname = ogNickname.split('|')[1].trim();
  }

  let name: string = '';
  let initials: Array<string> = [];

  // split the message into words
  const words = messageContent.split(' ');
  name = words[0];
  // Change name to lowercase with the first letter uppercase
  name = name.toLowerCase();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  for (let i = 1; i < words.length; i++) {
    initials.push(words[i][0]);
  }

  console.log(`${ogNickname} initials are ${initials}`);

  let nameWithInitials: string = name;
  if (initials.length > 0) {
    nameWithInitials = nameWithInitials + ` ${initials.join(". ")}`;
  }

  let newNickname: string = `${ogNickname} | ${nameWithInitials}`;

  // if the new nickname is too long, shorten it and send a dm to the user
  if (nameWithInitials.length > 32) {
    nameWithInitials = nameWithInitials.substring(0, 29) + '...';
    console.log(`${ogNickname} 's nickname is too long, shortening to ${nameWithInitials}`);

    // send a dm to the user
    guildMember.send(`Twój nick z initiałami byłby za długi, skracam do ${nameWithInitials}`);
  }

  // set the nickname
  guildMember.setNickname(newNickname);

  // add the role
  guildMember.roles.add(ROLE_ID);
}


// set commitSHA to dev if using a local version
let commitSHA: string = '';
if (process.env.GH_SHA === undefined) {
  commitSHA = 'dev';
}
else {
  commitSHA = process.env.GH_SHA;
}

client.on('ready', () => {
  if (client.user === null) {
    return;
  }

  // set the bot's status
  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: 'SGGW',
        type: ActivityType.Watching,
      },
    ],
  });
  console.log(`Logged in as ${client.user.tag}, commit: ` + commitSHA);
});

// if a message is sent in the channel with id CHANNEL_ID in the guild with id GUILD_ID
client.on('messageCreate', (message: Message) => {
  // if the message is sent as a dm, log it
  if (message.channel.type === ChannelType.DM) {
    console.log(`DM from ${message.author.tag}: ${message.content}`);
  }

  // if the message is sent in the correct channel in the correct guild
  if (message.guild?.id === GUILD_ID && message.channel.id === CHANNEL_ID) {
    changeNickname(message.member as GuildMember, message.content);
  }
});

const token = process.env.BOT_TOKEN;

// get token from file if env variable is not set
if (token === undefined) {
  const fs = require('fs');
  const tokenFromFile = fs.readFileSync('token.txt', 'utf8');
  client.login(tokenFromFile);
} else {
  client.login(token);
}