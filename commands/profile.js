module.exports = {
    data: new builders.SlashCommandBuilder()
        .setName("profile")
        .setDescription("Показывает профиль пользователя")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("Цель, чей профиль будет выведен")),
    async run(interaction) {
        if (!interaction.inGuild() || interaction.guild.id != "268016248585977873") return interaction.reply({ embeds: [{ title: "Нет доступа", description: `Эта команда доступна лишь для Сервера [Street Angelus](https://discord.gg/GmPSwYUYB9).`, color: 16747660, footer: { text: "SAM Role-Manager", icon: client.user.displayAvatarURL({ size: 512, format: "webp" })}}]})
        let user = interaction.options.getUser('target') || interaction.user;
        let member = interaction.guild.members.cache.get(user.id)
        let group = null;
        let groupColor = null;
        let level = null;

        const { levelRoles } = require('../roles.json') 
        member.roles.cache.forEach(r => {
            let group_roles_id = ["988404285731667988", "988414273267064892", "988414427143487569", "988414540536483840"];
            let level_roles_id = ["988433360911237180", "988433362253402182", "988433363436187689", "988433364837101608"];

            if (group_roles_id.includes(r.id)) {
                group = `<@&${r.id}>`
                groupColor = r.color
            }

            if (level_roles_id.includes(r.id)) {
                level = levelRoles[r.id];
            }
        })

        let embed = {
            thumbnail: {
                url: user.displayAvatarURL({ size: 4096, dynamic: true, format: "webp" }),
            },
            title: `${user.username}`,
            description: `${ member.nickname ? `**Прозвище** \`${member.nickname}\`\n` : "" }**Группировка ›** ${group}\n**Ранг ›** ${level}`,
            color: groupColor
        }
        let reply = await interaction.reply({ embeds: [embed] });
    }
}