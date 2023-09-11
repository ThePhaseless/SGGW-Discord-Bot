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
function changeNickname(user: GuildMember, messageContent: string) {
  let nickname = user.nickname;

  if (nickname === null) {
    // if the user doesn't have a nickname, use their username
    nickname = user.user.username;
  }

  // retrieve original nickname if the user already has an initial
  if (nickname.includes('|')) {
    nickname = nickname.split('|')[1].trim();
  }

  let initials = '';
  // if the message has at least 2 words, use the first word and the first letters of the rest of the words
  if (messageContent.split(' ').length > 1) {
    const words = messageContent.split(' ');
    initials = words[0];
    for (let i = 1; i < words.length; i++) {
      initials += ' ' + words[i].charAt(0).toUpperCase() + '.';
    }
  } else {
    // if the message has only one word, use the whole word
    initials = messageContent;
  }

  // log the message
  console.log(`${nickname} initials are ${initials}`);

  let newNickname = initials + ' | ' + nickname;
  if (newNickname.length > 32) {
    newNickname = newNickname.substring(0, 32);

    // log the message
    console.log(`${nickname}'s nickname is too long, shortening to ${newNickname}`);

    // send a dm to the user
    user.send(`Twój nick z initialami byłby za długi, skracam do ${newNickname}`);
  }
  // set the nickname
  user.setNickname(initials + ' | ' + nickname);
  user.roles.add(ROLE_ID);
}

// set commitSHA to dev if using a local version
let commitSHA = process.env.GH_SHA;
if (commitSHA === undefined) {
  commitSHA = 'dev';
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
