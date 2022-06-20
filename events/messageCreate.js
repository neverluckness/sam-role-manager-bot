module.exports = {
    name: "messageCreate",
    async run(message) {
        if (message.author.id === config.dev && message.content.startsWith(config.devPrefix)) {
            let args = message.content.slice(config.devPrefix.length).split(/ +/g)
            let cmd = args.shift().toLowerCase()
            switch (cmd) {
                case 'init': 
                    __init(message, args)
                    break;
                case 'eval':
                    __eval(message, args)
                    break;
                case 'embed':
                    __embed(message, args)
                    break;
            }
        }
    } 
}

const __init = async (message, args) => {
    const fs = require('node:fs');
    const path = require('node:path');
    console.log(`${utils.time(new Date, true)} › Application Commands Registration...`)
    let msg = await message.channel.send(`> Application Commands Registration...`)
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }


    const rest = new REST({ version: '9' }).setToken(config.token);
    (async () => {
        try {
    
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log(`${utils.time(new Date, true)} › Application Commands successfully registred!`)
            msg.edit(`> Application Commands successfully registred!`)
        } catch (error) {
            console.error(error);
        }
    })();
}

const __eval = async (message, args) => {
    let _input = args.join(" ");
    let _output = undefined;
    try {
        _output = await eval(_input);
        message.react("✅")
    } catch (e) {
        message.react("❎")
        _output = e
    }

    let _responce = await message.channel.send({
        embeds: [{
            title: "Evaluated",
            description: `${_output === undefined ? "```js\n// No output or Async.\n```" : `\`\`\`js\n${_output}\n\`\`\``}`,
            footer: {
                text: "This message will be deleted in 10s"
            }
        }]
    })

    setTimeout(() => {
        _responce.delete()
        message.delete()
    }, 10*1000)
}

const __embed = async (message, id) => {
    const { MessageActionRow, MessageSelectMenu } = require('discord.js')
    let msg = null
    if (id[0] == "factions") {
        msg = {
            embeds: [{
                title: "Роли-Группировки",
                description: `Меню для выбора группировки, влияет только на цвет вашего ника.
                Так же вы можете сменить группировку, используя команду \`/faction switch\`.
                Роль, выдаваемая при входе по умолчанию › <@&988404285731667988>\n
                Все доступные роли › <@&988404285731667988> <@&988414273267064892> <@&988414427143487569> <@&988414540536483840>`
            }],
            components: [new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('faction')
                        .setPlaceholder('Выбрать группировку')
                        .addOptions([
                            {
                                label: 'Вольные Сталкеры',
                                description: 'Сталкеры, исследующие Зону в одиночку.',
                                value: 'stalker',
                                isDefault: true
                            },
                            {
                                label: 'Бандиты',
                                description: 'Представители криминального мира, пришедшие в Зону по разным причинам.',
                                value: 'bandit',
                            },
                            {
                                label: 'Свобода',
                                description: 'Анархисты и сорвиголовы, объявившие себя борцами за свободу на территории Зоны.',
                                value: 'freedom',
                            },
                            {
                                label: 'Долг',
                                description: 'Явно военизированная группировка, отличающаяся строгой дисциплиной. ',
                                value: 'duty',
                            }]))]
        }
    }

    else if (id[0] == "ranks") {
        msg = {
            embeds: [{
                title: "Роли-Ранги (Уровни)",
                description: `За активность в чате, участники сервера поднимают свой уровень, достигая новых рангов. Ранги влияют на права пользователей, но не меняют цвет ника.
                Первоначальный ранг (0 уровень) › <@&988433360911237180>\n
                Всего рангов 4 › 
                <@&988433360911237180> <@&988433362253402182> <@&988433363436187689> <@&988433364837101608>`
            }]
        }
    }

    await message.channel.send(msg)
    message.delete()
}