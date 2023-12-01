class Ping {
    constructor(client) {
        this.name = "ping";
        this.category = "Information";
        this.aliases = ["latency"];
        this.client = client;
    }
   async run(message, args) {
        try {
            return this.client.edit(`Pong:: \`${this.client.ws.ping}\`ms`, message).then(m => {
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

module.exports = Ping;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
