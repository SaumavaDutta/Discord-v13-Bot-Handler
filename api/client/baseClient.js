const EventEmitter = require('node:events');
const process = require('node:process');
const BaseMessage = require(`${process.cwd()}/api/structure/BaseMessage.js`);
const { Collection } = require('@discordjs/collection');
const ProxyRequestHandler = require(`${process.cwd()}/api/manager/ProxyRequestHandler.js`);
const { Client, Options, ShardClientUtil, ClientPresence, WebSocketManager } = require("discord.js");
class BaseClient extends Client {
  constructor(options = {}) {
    super(options);
    this.options = options;
    this.message = new BaseMessage(this);
    if (typeof this.options !== 'object' || this.options === null) {
      throw new TypeError("'options' must be an 'object' type but recieved "+(typeof this.options)+" type");
    }
    const data = require('node:worker_threads').workerData ?? process.env;
    const defaults = Options.createDefault();
   if (this.options.shards === defaults.shards) {
      if ('SHARDS' in data) {
        this.options.shards = JSON.parse(data.SHARDS);
      }
    }

    if (this.options.shardCount === defaults.shardCount) {
      if ('SHARD_COUNT' in data) {
        this.options.shardCount = Number(data.SHARD_COUNT);
      } else if (Array.isArray(this.options.shards)) {
        this.options.shardCount = this.options.shards.length;
      }
    }

    const typeofShards = typeof this.options.shards;

    if (typeofShards === 'undefined' && typeof this.options.shardCount === 'number') {
      this.options.shards = Array.from({ length: this.options.shardCount }, (_, i) => i);
    }

    if (typeofShards === 'number') this.options.shards = [this.options.shards];

    if (Array.isArray(this.options.shards)) {
      this.options.shards = [
        ...new Set(
          this.options.shards.filter(item => !isNaN(item) && item >= 0 && item < Infinity && item === (item | 0)),
        ),
      ];
    }
    this.ws = new WebSocketManager(this);
    super._validateOptions(this.options);
    this.presence = new ClientPresence(this, this.options.presence);
    if(this.options.rest?.api){
      new ProxyRequestHandler();
    }
  }

  async login(token = super.token) {
    if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID');
    super.token = token = token.replace(/^(Bot|Bearer)\s*/i, '');
    this.emit(
      "debug",
      `Provided token: ${token
        .split('.')
        .map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
        .join('.')}`,
    );

    if (this.options.presence) {
      this.options.ws.presence = this.presence._parse(this.options.presence);
    }

    super.emit("debug", 'Preparing to connect to the gateway...');

    try {
      await this.ws.connect();
      return super.token;
    } catch (error) {
      super.destroy();
      throw error;
    }
  }

  isReady() {
    return this.ws.status === Status.READY;
  }

  destroy() {
    super.destroy();

    for (const fn of super._cleanups) fn();
    super._cleanups.clear();

    if (super.sweepMessageInterval) clearInterval(super.sweepMessageInterval);

    super.sweepers.destroy();
    this.ws.destroy();
    super.token = null;
  }

}

module["exports"] = {
  BaseClient: BaseClient,
  Collection: Collection
};

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
