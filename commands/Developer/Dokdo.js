
const Dok = require('dokdo');
class Dokdo {
    constructor(client) {
        this.name = "dokdo";
        this.category = "Developer";
        this.aliases = ["dok", "dokdo"];
        this.client = client;
    }
   async run(message, args) {
        try {
            if(!this.client.config.developers.includes(message.author.id)) return;
            let prefix = [this.client.config.prefix, ""];
            for(let i = 0; i < prefix.length; i++){
              if(message.content.toLowerCase().startsWith(prefix[i].toLowerCase())){
                const DokdoHandler = new Dok(this.client, { aliases: this.aliases, owners: this.client.config.developers, prefix: prefix[i] });
               return DokdoHandler.run(message);
              }
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
}

module.exports = Dokdo;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/