module.exports = {
    async run (interaction) {
        let menuId = interaction.customId
        if (menuId == "faction") {
            await factionSMenu(interaction)
            return
        }
    }
}


const _groups = { "stalker": "988404285731667988", "bandit": "988414273267064892", "freedom": "988414427143487569", "duty": "988414540536483840" }
const _roles = ['988404285731667988', '988414273267064892', '988414427143487569', '988414540536483840']
const factionSMenu = async (interaction) => {
    let group = interaction.values[0]
    let guild = client.guilds.cache.get("268016248585977873")
    let role = guild.roles.cache.get(_groups[group])

    if (interaction.member.roles.cache.has(role)) {
        interaction.reply({ content: `🟥 Вы уже состоите в этой группировке.`, ephemeral: true })
        return;
    }

    _roles.forEach(_r => {
        if (_r === role.id) return;
        if (interaction.member.roles.cache.has(_r)) {
            interaction.member.roles.remove(guild.roles.cache.get(_r))
        }
    })

    interaction.member.roles.add(role)
    interaction.reply({ content: `✅ Вы успешно сменили группировку.`, ephemeral: true })
}