const { BaseClient, Collection } = require(`${process.cwd()}/api/client/BaseClient.js`);
const Proxy = require(`${process.cwd()}/api/manager/ProxyRequestHandler.js`);
const PartialManager = require(`${process.cwd()}/api/manager/PartialsManager.js`);
const IntentsManager = require(`${process.cwd()}/api/manager/IntentsBitFieldManager.js`);
const { Permissions } = require("discord.js");
const ActivityType = require(`${process.cwd()}/api/manager/ActivityBitFieldManager.js`);
const Events = require(`${process.cwd()}/api/structure/Events.js`);
const MessageEmbed = require(`${process.cwd()}/api/components/Embed.js`);
const MessageButton = require(`${process.cwd()}/api/components/Buttons.js`);
const Message = require(`${process.cwd()}/api/components/Message.js`);
const Status = require(`${process.cwd()}/api/manager/Status.js`);
const { getChannel, getChannels } = require(`${process.cwd()}/api/components/GetChannels.js`);
const { getGuild, getGuilds } = require(`${process.cwd()}/api/components/getGuilds.js`);
const { getUser } = require(`${process.cwd()}/api/components/GetUsers.js`);
const BaseMessage = require(`${process.cwd()}/api/structure/BaseMessage.js`);
module.exports = {
    BaseClient: BaseClient,
    Collection: Collection,
    ProxyRequestHandler: Proxy,
    Partials: PartialManager,
    Permissions: Permissions,
    Intents: IntentsManager,
    Events: Events,
    ActivityType: ActivityType,
    EmbedBuilder: MessageEmbed,
    ButtonBuilder: MessageButton,
    Message: Message,
    Status: Status,
    getChannel: getChannel,
    getGuild: getGuild,
    getUser: getUser,
    getChannels: getChannels,
    getGuilds: getGuilds,
    BaseMessage: BaseMessage
}

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/