const { EmbedBuilder, Permissions, Collection } = require(`${process.cwd()}/api/`);
class messageUpdate {
    constructor(client) {
        this.client = client;
    }
    async run(oM, message) {
        try {
            //Checking whether the message sender/author must not be a bot and as well as a webhook id and the message must be the instance of a guild<Message>
            if (message.author?.bot || !message.guild || !message.channel || !message.guild.available || message.webhookId) return;
            
            if(oM?.content.trim().toLowerCase() == message.content.trim().toLowerCase()) return null;
            //decalring prefix in array to store o prefix in it later.
            let prefix = [this.client.config.prefix];

            if (this.client.config.developers.includes(message.author.id)) prefix.push("");  //noprefix declaration

            if (message.channel?.partial) await message.channel.fetch().catch(() => null);

            if (message.member?.partial) await message.member.fetch().catch(() => null);
                //Finding the corresponding prefix from the message content to the array using Regex
               
            const test = prefix.findIndex(p => new RegExp(`^(<@!?${this.client.user.id}>|${this.escapeRegex(p)})\\s*`).test(message.content.toLowerCase()));
                
            if(test == -1) return; //prefix not matched
               
            //Getting the regex value
            const regex = new RegExp(`^(<@!?${this.client.user.id}>|${this.escapeRegex(prefix[test])})\\s*`);
           
            const [, match] = message.content.toLowerCase().match(regex);

            const args = message.content.slice(match.length).trim().split(/ +/);

            const splited = args?.shift()?.toLowerCase();
           
            if (splited.length === Number(new Boolean(![]))) {

                if (!message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
                    return this.client.edit(`:x: \`EXTERNAL EMOJIS\` Permission is missing.`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS))
                    return this.client.edit(`:x: \`EMBED LINKS\` permission is missing`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                if (!message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS))
                    return this.client.edit(`:x: \`ADD REACTIONS\` permission is missing`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                if (match.includes(this.client.user.id)) return this.client.edit({ content: `Hey Iam **__${this.client.user.username}__**\n\nPrefix to **execute** my commands: \`${this.client.config.prefix}\`, <@!${this.client.user.id}> (fixed)\n\nType \`${this.client.config.prefix}help\` or \`@${this.client.user.username} help\` for more info.` }, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });
           
            }
            
            let cmd = this.client.commands.get(splited);

            if (!cmd) cmd = this.client.commands.get(this.client.aliases.get(splited));

            if (cmd) {
                //Cooldown for every command (default - 5 sec)
                if (!this.client.config.developers.includes(message.author.id)) {

                    if (!this.client.cooldowns.has(cmd.name)) {

                        this.client.cooldowns.set(cmd.name, new Collection());

                    }
                    const now = Date.now();

                    const timestamps = this.client.cooldowns.get(cmd.name);

                    const cooldownAmount = cmd?.cooldown || (5 * 1000);

                    if (timestamps.has(message.author.id)) {

                        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                        if (now < expirationTime) {

                            const timeLeft = (expirationTime - now) / 1000;

                            return this.message.send({ embeds: [new EmbedBuilder().setColor(this.client.config.embeds.color).setDescription(`Please wait, this command is on cooldown for \`${timeLeft.toFixed(1)}s\``)] }, message.channel.id).then(msg => {
                                setTimeout(() => msg.delete().catch((e) => {
                                    return
                                }), 5000);
                            })
                        }
                    }
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                }


                if (!message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
                    return this.client.edit(`:x: \`EXTERNAL EMOJIS\` Permission is missing.`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS))
                    return this.client.edit(`:x: \`EMBED LINKS\` permission is missing`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                if (!message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS))
                    return this.client.edit(`:x: \`ADD REACTIONS\` permission is missing`, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });

                //executing the command
                await cmd.run(message, args);
            }
        } catch (e) {
            this.client.edit({ content: ":x: Something went wrong." }, message).then(m => {
      this.client.msg.set(message.id, {
        edit: m.id
      });
    });
            return this.client.logger.log(e, { type: this.client.constants.err });
        }
    }
    escapeRegex(string) {
    try {
        return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        this.client.logger.log(e, { type: this.client.constants.err });
    }
}
}
module.exports = messageUpdate;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
