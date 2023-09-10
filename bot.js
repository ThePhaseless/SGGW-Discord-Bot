const Discord = require('discord.js');
const client = new Discord.Client();

const GUILD_ID = '1148257084698275840';
const CHANNEL_ID = '1149818259462439003';
const ROLE_ID = "1149823675764330588";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // set the bot status
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'jak przeżyć na studiach',
      type: 'WATCHING',
    },
  });
});
// if message is sent in the channel with id CHANNEL_ID in the guild with id GUILD_ID
client.on('message', (message) => {
  if (message.guild.id === GUILD_ID && message.channel.id === CHANNEL_ID) {
    // log the message
    // add the message to the senders nickname
    var nickname = message.member.nickname;
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
    
    var newnickname = inicial + ' | ' + nickname;
    if (newnickname.length > 32) {
      newnickname = newnickname.substring(0, 32);

      // log the message
      console.log(`${nickname}s nickname is too long, shortening to ${newnickname}`);

      // send a dm to the user
      message.author.send(`Twój nick z initialami jest za długi, skracam do ${newnickname}`);
    }
    // set the nickname
    message.member.setNickname(inicial + ' | ' + nickname);
    message.member.roles.add(ROLE_ID);
  }
});
// get token from environment variable
client.login(process.env.BOT_TOKEN);