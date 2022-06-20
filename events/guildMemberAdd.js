module.exports = {
    name: "guildMemberAdd",
    async run(guildMember) {
        if (guildMember.guild.id != "268016248585977873") return;

        if (guildMember.user.bot) {
            guildMember.roles.add(guildMember.guild.roles.cache.get(require("../roles.json").defaultRoles.bot))
        }
        else {
            guildMember.roles.add(guildMember.guild.roles.cache.get(require("../roles.json").defaultRoles.user))
        }
    }
}