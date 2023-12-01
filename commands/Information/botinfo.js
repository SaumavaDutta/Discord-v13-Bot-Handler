const { EmbedBuilder } = require(`${process.cwd()}/api/`);
class Botinfo {
    constructor(client) {
        this.client = client;
        this.name = "botinfo";
        this.aliases = ["stats", "bi"];
        this.category = "Information";
    }
   async run(message, args) {
    try {
        const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL || this.client.user.displayAvatarURL() })
            .setDescription(`\`\`\`fix\nBot Tag: ${this.client.user.tag} | [${this.client.user.id}]\nDevelopers: ashton.gg [1069555290875367496]\`\`\`\n**Bot Latency**: ${this.client.ws.ping} ms\n**Total Servers**: ${this.client.guilds.cache.size}\n**Total Channels**: ${this.client.channels.cache.size}\n**Total Users**: ${this.client.guilds.cache.reduce((x, y) => x + y.memberCount, 0)}`)
            .setColor(this.client.config.embeds.color)
            .setFooter({ text: `${this.client.config.embeds.footer}`, iconURL: `${(await this.client.users.fetch('1069555290875367496')).displayAvatarURL({ dynamic: true })}` });
        return this.client.edit({ embeds: [embed] }, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });
   } catch (e) {
             this.client.edit({ content: ":x: Something went wrong." }, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });
            return this.client.logger.log(e, { type: this.client.constants.err });
        }
  }
}

module.exports = Botinfo;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/