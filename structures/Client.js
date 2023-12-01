const { BaseClient, Collection } = require(`${process.cwd()}/api/`);
const Constants = require(`${process.cwd()}/structures/Constants.js`);
const Logger = require(`${process.cwd()}/structures/Logger.js`);
const Events = require(`${process.cwd()}/structures/Events.js`);
const Commands = require(`${process.cwd()}/structures/Commands.js`);
const Handlers = require(`${process.cwd()}/structures/Handlers.js`);
const config = require(`${process.cwd()}/config.json`);
class Bot extends BaseClient {
    constructor(options = {}) {
        super({
            ...{},
            ...options
        });
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.constants = new Constants();
        this.logger = new Logger(this);
        this.events = new Events(this);
        this.handler = new Handlers(this);
        this._commands = new Commands(this);
        this.config = config;
        this.msg = new Collection();
        this.eventsLoad();
        this.edit = async(options, msg) => {
                try {
              const data = this.msg.get(msg?.id);
              const msg_edit = await msg.channel.messages.fetch(data?.edit || "undefined").catch(() => null);
                 if (msg_edit && data?.edit) 
                    return (await msg_edit.edit({ content: typeof options === "string" ? options : !!options?.content ? options?.content : " ", embeds: !!options?.embeds ? options?.embeds : [], components: !!options?.components ? options?.components : [], files: !!options?.files ? options?.files : []}).catch(() => null));
                 else
                    return (await this.message.send({ content: typeof options === "string" ? options : !!options?.content ? options?.content : " ", embeds: !!options?.embeds ? options?.embeds : [], components: !!options?.components ? options?.components : [], files: !!options?.files ? options?.files : []}, msg.channel.id).catch(() => null));
             } catch(_) {
                    return null;
            }
        }
    }
    eventsLoad() {
        this.events.load();
        this.commandsLoad();
        this.handlersLoad();
    }
    commandsLoad() {
        this._commands.load();
    }
    handlersLoad(){
        this.handler.load();
    }
    access(token){
        if (typeof token !== "string") return this.logger.log("Error :: token must be a string type", { type: this.constants.tErr });
        return super.login(token);
    }
}

module.exports = Bot;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/