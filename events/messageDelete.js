const { EmbedBuilder, Permissions, Collection } = require(`${process.cwd()}/api/`);
class messageDelete {
    constructor(client) {
        this.client = client;
    }
    async run(message) {
        try {
       const data = this.client.msg.get(message?.id);
              const msg_edit = await message.channel.messages.fetch(data?.edit || "undefined").catch(() => null);
                 if (msg_edit && data?.edit) 
                   msg_edit.delete().catch(() => null);
                this.client.msg.delete(message?.id);
        } catch(_) {
            return null;
        }
    }
}

module.exports = messageDelete;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/