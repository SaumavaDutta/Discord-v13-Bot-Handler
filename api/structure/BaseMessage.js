const { getChannel } = require(`${process.cwd()}/api/components/GetChannels.js`);
const { getUser } = require(`${process.cwd()}/api/components/GetUsers.js`);
class BaseMessage {
    constructor(client){
        this.client = client;
    }
  async send(options, id){
    const channel = await getChannel(this.client, id, true);
    if(!channel) throw new TypeError("Cannot send message to an undefined channel.");
    try {
    const message = await this.client.api.channels(channel.id).messages.post({
      data: options
    });
    return message;
  } catch (e){
    throw new Error("Unable to send the message", e);
  }
  }
  async reply(options, id, messageId){
    const channel = await getChannel(this.client, id, true);
    if(!channel) throw new TypeError("Cannot send message to an undefined channel.");
    let structure = {
      ...options,
      message_reference: {
          message_id: messageId,
        }
    }
    try {
    const message = await this.client.api.channels(channel.id).messages.post({
      data: structure
    });
    return message;
  } catch (e){
    throw new Error("Unable to reply to the message", e);
  }
  }
  async sendDM(options, id){
     const user = await getUser(this.client, id, true);
    if(!user) throw new TypeError("Cannot send message privately.");
    try {
    await this.client.api.users(user.id).messages.post({
      data: options
    });
  } catch (e){
    throw new Error("Unable to send the message privately", e);
  }
  }
}
module.exports = BaseMessage;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
