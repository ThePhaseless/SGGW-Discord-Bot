const Discord = require('discord.js');
const client = new Discord.Client();

const GUILD_ID = '1148257084698275840';
const CHANNEL_ID = '1149818259462439003';
const ROLE_ID = "1149823675764330588";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// if message is sent in the channel with id CHANNEL_ID in the guild with id GUILD_ID
client.on('message', (message) => {
  if (message.guild.id === GUILD_ID && message.channel.id === CHANNEL_ID) {
    // add the message to the senders nickname
    var nickname = message.member.nickname || message.author.username;
    var inicial = ""
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
    
      // set the nickname
      message.member.setNickname(inicial + ' | ' + nickname);
      message.member.roles.add(ROLE_ID);
    
  }
});

// get token from environment variable
client.login(process.env.BOT_TOKEN);
