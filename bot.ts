import { ChannelType, Client, Events, GatewayIntentBits, Message } from 'discord.js';
import { Logger, ILogObj } from 'tslog';
import { registerCommands, triggerOnMessage } from './lib/functions.ts';
import { BOT_TOKEN, CHANNEL_ID, OWNER_ID } from './lib/consts.ts';


const log: Logger<ILogObj> = new Logger();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});



log.info('Starting bot...');

client.once(Events.ClientReady, readyClient => {
  log.info(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.Error, error => {
  log.error(error);
});

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
  if (newMessage.author === null || newMessage.content === null) {
    return;
  }
  if (newMessage.channel.type === ChannelType.DM) {
    log.info(`DM from ${newMessage.author.tag} changed from ${oldMessage.content} to ${newMessage.content}`);
    return;
  }

  if (newMessage.partial) {
    newMessage.fetch().then(message => {
      triggerOnMessage(message);
    });
    return;
  }
});

client.on(Events.MessageCreate, (message) => {
  triggerOnMessage(message);
});

client.login(BOT_TOKEN);

// Cache the DM channel with the owner
client.users.fetch(OWNER_ID)
  ?.then
  (user => user.createDM()
    .then(dmChannel => client.channels.cache.set(dmChannel.id, dmChannel))
  );

export { log, client };
