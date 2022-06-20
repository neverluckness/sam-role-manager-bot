const __roles = ['988404285731667988', '988414273267064892', '988414427143487569', '988414540536483840']
module.exports = {
    data: new builders.SlashCommandBuilder()
        .setName("faction")
        .setDescription("Команда для выбора группировки")
        .addSubcommand(subcommand => subcommand
            .setName("switch")
            .setDescription("Изменить группировку")
            .addStringOption(option => option
                .setName('group')
                .setDescription('Группировка')
                .setRequired(true)
                .addChoices(
                    { name: 'Вольные Сталкеры', value: '988404285731667988' },
                    { name: 'Бандиты', value: '988414273267064892' },
                    { name: 'Свобода', value: '988414427143487569' },
                    { name: 'Долг', value: '988414540536483840' })))
        .addSubcommand(subcommand => subcommand
            .setName("mod")
            .setDescription("Изменить группировку другому пользователю (Только модераторы)")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Цель, пользователь которому нужно изменить группировку")
                .setRequired(true))
            .addStringOption(option => option
                .setName("group")
                .setDescription("Группировка")
                .setRequired(true)
                .addChoices(
                    { name: 'Вольные Сталкеры', value: '988404285731667988' },
                    { name: 'Бандиты', value: '988414273267064892' },
                    { name: 'Свобода', value: '988414427143487569' },
                    { name: 'Долг', value: '988414540536483840' }))),
    async run(interaction) {
        if (!interaction.inGuild() || interaction.guild.id != "268016248585977873") return interaction.reply({ embeds: [{ title: "Нет доступа", description: `Эта команда доступна лишь для Сервера [Street Angelus](https://discord.gg/GmPSwYUYB9).`, color: 16747660, footer: { text: "SAM Role-Manager", icon: client.user.displayAvatarURL({ size: 512, format: "webp" })}}]})

        let subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case 'switch':
                await switchFaction(interaction)
                break;
            case 'mod':
                await modFaction(interaction)
                break;
        }
    }
}
const switchFaction = async (interaction) => {
    let group = interaction.options.getString("group")
    let guild = client.guilds.cache.get("268016248585977873")
    let role = guild.roles.cache.get(group)

    if (interaction.member.roles.cache.has(role)) {
        interaction.reply({ content: `🟥 Вы уже состоите в этой группировке.`, ephemeral: true })
        return;
    }

    __roles.forEach(_r => {
        if (_r === role.id) return;
        if (interaction.member.roles.cache.has(_r)) {
            interaction.member.roles.remove(guild.roles.cache.get(_r))
        }
    })

    interaction.member.roles.add(role)
    interaction.reply({ content: `✅ Вы успешно сменили группировку.`, ephemeral: true })
}

const modFaction = async (interaction) => {
    let { modRoles } = require('../roles.json');
    let isMemberMod = false;
    interaction.member.roles.cache.forEach(_r => {
        if (modRoles.includes(_r.id)) {
            isMemberMod = true;
        } 
    })

    if (!isMemberMod) return interaction.reply({ content: `🟥 У вас не достаточно прав.`, ephemeral: true })

    let group = interaction.options.getString("group")
    let guild = client.guilds.cache.get("268016248585977873")
    let member = guild.members.cache.get(interaction.options.getUser("target").id)
    let role = guild.roles.cache.get(group)

    if (member.roles.cache.has(role)) {
        interaction.reply({ content: `🟥 Пользователь \`${member.user.tag}\` уже состоит в этой группировке.`, ephemeral: true })
        return;
    }

    __roles.forEach(_r => {
        if (_r === role.id) return;
        if (member.roles.cache.has(_r)) {
            member.roles.remove(guild.roles.cache.get(_r))
        }
    })

    member.roles.add(role)
    interaction.reply({ content: `✅ Модератор ${interaction.user} изменил группировку пользователю ${member.user}.`, ephemeral: false })
}