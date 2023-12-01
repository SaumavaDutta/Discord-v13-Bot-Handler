const Client = require(`${process.cwd()}/structures/Client.js`);
const Discord = require("discord.js");
const config = require(`${process.cwd()}/config.json`)
const { Intents, Partials } = require(`${process.cwd()}/api/`);
const intent = new Intents();
//Initializing the Client Class with priviledged enabled Intents for discord Gateway Payloads Entry.
const client = new Client({
    fetchAllMembers: false,
    failIfNotExists: false,
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    },
    rest: {
		api: config.REST.URI,
	},
    partials: [Partials.MESSAGE, Partials.CHANNEL, Partials.REACTION, Partials.GUILD_MEMBER, Partials.USER],
    intents: [
    intent.bitfield.FLAGS.GUILDS,
    intent.bitfield.FLAGS.GUILD_MEMBERS,
    intent.bitfield.FLAGS.GUILD_BANS,
    intent.bitfield.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    intent.bitfield.FLAGS.GUILD_INTEGRATIONS,
    intent.bitfield.FLAGS.GUILD_INVITES,
    intent.bitfield.FLAGS.GUILD_VOICE_STATES,
    intent.bitfield.FLAGS.GUILD_MESSAGES,
    intent.bitfield.FLAGS.GUILD_MESSAGE_REACTIONS,
    intent.bitfield.FLAGS.GUILD_MESSAGE_TYPING,
    intent.bitfield.FLAGS.DIRECT_MESSAGES,
    intent.bitfield.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    presence: {
        activities: [
            {
                name: `${config.status.text}`, type: config.status.type
            }
        ],
        status: config.status
    }
});

client.access(config.token || process.env.TOKEN);

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
