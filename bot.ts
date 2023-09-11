import { GuildMember } from "discord.js";

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


const GUILD_ID = '1148257084698275840';
const CHANNEL_ID = '1149818259462439003';
const ROLE_ID = "1149823675764330588";

console.log("Starting bot...");

// function to change nickname
function changeNickname(user: GuildMember, messageContent: string) {
  var nickname = user.nickname;

  if (nickname === null) {
    nickname = user.user.username;
  }

  // retrive original nickname if the user has already have a initial
  if (nickname.includes('|')) {
    nickname = nickname.split('|')[1].trim();
  }

  var inicial = "";
  // if the message has at least 2 words, use the first word and the first letters of the rest of the words
  if (messageContent.split(' ').length > 1) {
    var words = messageContent.split(' ');
    inicial = words[0];
    for (var i = 1; i < words.length; i++) {
      inicial += ' ' + words[i].charAt(0).toUpperCase() + '.';
    }
  }
  else {
    // if the message has only one word, use whole word
    inicial = messageContent;
  }

  // log the message
  console.log(`${nickname} inicial is ${inicial}`);

  var newNickname = inicial + ' | ' + nickname;
  if (newNickname.length > 32) {
    newNickname = newNickname.substring(0, 32);

    // log the message
    console.log(`${nickname}s nickname is too long, shortening to ${newNickname}`);

    // send a dm to the user
    user.send(`Twój nick z initialami byłby za długi, skracam do ${newNickname}`);
  }
  // set the nickname
  user.setNickname(inicial + ' | ' + nickname);
  user.roles.add(ROLE_ID);
}

// set commitSHA to dev if using local version
var commitSHA = process.env.GH_SHA;
if (commitSHA === undefined) {
  commitSHA = "dev";
}

client.on('ready', () => {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'SGGW',
      type: 'COMPETING',
    }
  });
  console.log(`Logged in as ${client.user.tag}, commit: ` + commitSHA);
});
// if message is sent in the channel with id CHANNEL_ID in the guild with id GUILD_ID
client.on('messageCreate', (message) => {
  // if the message is sent as a dm, log it
  if (message.channel.type === 'dm') {
    console.log(`DM from ${message.author.tag}: ${message.content}`);
  }

  // if the message is sent in the correct channel in the correct guild
  if (message.guild.id === GUILD_ID && message.channel.id === CHANNEL_ID) {

    changeNickname(message.member, message.content)
    // add the message to the senders nickname
    var nickname = message.member.nickname;

    // retrive original nickname if the user has already have a initial
    if (nickname.includes('|')) {
      nickname = nickname.split('|')[1].trim();
    }

    var inicial = "";
    // if the message has at least 2 words, use the first word and the first letters of the rest of the words
    if (message.content.split(' ').length > 1) {
      var words = message.content.split(' ');
      inicial = words[0];
      for (var i = 1; i < words.length; i++) {
        inicial += ' ' + words[i].charAt(0).toUpperCase() + '.';
      }
    }
    else {
      // if the message has only one word, use whole word
      inicial = message.content;
    }

    // log the message
    console.log(`${nickname} inicial is ${inicial}`);

    var newNickname = inicial + ' | ' + nickname;
    if (newNickname.length > 32) {
      newNickname = newNickname.substring(0, 32);

      // log the message
      console.log(`${nickname}s nickname is too long, shortening to ${newNickname}`);

      // send a dm to the user
      message.author.send(`Twój nick z initialami byłby za długi, skracam do ${newNickname}`);
    }
    // set the nickname
    message.member.setNickname(inicial + ' | ' + nickname);
    message.member.roles.add(ROLE_ID);
  }
});

var token = process.env.BOT_TOKEN;

// get token from file if env variable is not set
if (token === undefined) {
  const fs = require('fs');
  const token = fs.readFileSync('token.txt', 'utf8');
  client.login(token);
}

client.login(token);