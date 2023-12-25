import { ApplicationCommandOptionType, ChannelType, GuildMember, Message } from "discord.js";
import { CHANNEL_ID, ROLE_ID } from "./consts";
import { client, log } from "../bot";

function generateNewNickname(messageContent: string, ogNickname: string) {
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
        nameWithInitials = nameWithInitials + '.';
    }

    return `${nameWithInitials} | ${ogNickname}`;
}

function changeNickname(guildMember: GuildMember, messageContent: string) {
    const ogNickname = guildMember.nickname || guildMember.user.displayName;
    var newNickname = generateNewNickname(messageContent, ogNickname);

    // if the new nickname is too long, shorten it and send a dm to the user
    if (newNickname.length > 32) {
        newNickname = newNickname.substring(0, 29) + '...';
        log.warn(`${ogNickname} 's nickname is too long, shortening to ${newNickname}`);

        // send a dm to the user
        guildMember.send(`Twój nick z initiałami byłby za długi, skracam do ${newNickname}`);
    }

    // set the nickname
    guildMember.setNickname(newNickname)
        .catch((err) => {
            throw err;
        }
        );

    // add the role
    return guildMember.roles.add(ROLE_ID);
}

function triggerOnMessage(message: Message) {
    if (message.author.bot) {
        return;
    }
    else if (message.channel.type === ChannelType.DM) {
        log.info(`DM from ${message.author.tag}: ${message.content}`);
        message.author.send('Nowy nick: ' + generateNewNickname(message.content, message.author.displayName));
        return;
    }
    // if the message is sent in the correct channel in the correct guild
    else if (message.channel.id === CHANNEL_ID) {
        if (message.member === null) {
            log.error(`Message author: ${message.author.tag}`);
            message.delete();
            message.author.send('Wystąpił błąd, spróbuj ponownie później');
            return;
        }
        changeNickname(message.member, message.content)
            .catch((err) => {
                log.error(err);
                message.react('❌');
                message.author.send('Wystąpił błąd, napisz do administracji');
            }).then(() => {
                message.react('✅');
            });
    }
}

function registerCommands() {
    if (client.application === null) {
        log.fatal('Client application is null');
        process.exit(1);
    }
    client.application.commands.create({
        name: 'nick',
        description: 'Zmienia nick użytkownika',
        options: [
            {
                name: 'nick',
                description: 'Nowy nick',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    });
}

export { changeNickname, triggerOnMessage, registerCommands };