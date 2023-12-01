class ProxyRequestHandler {
constructor(){
    this.createServer = require('node:http').createServer;
    this.proxyRequests = require(`${process.cwd()}/api/utils/handlers/proxyRequests.js`).proxyRequests;
    this.REST = require('@discordjs/rest').REST;
    process.on('SIGINT', () => process.exit(0));
    this.api = new this.REST({ rejectOnRateLimit: () => true, retries: 0 });
    this.server = this.createServer(this.proxyRequests(this.api));
    this.port = Number.parseInt(process.env.PORT ?? '8080', 10);
    this.server.listen(this.port, () => console.log(`Listening on port ${this.port}`));
}
}
module["exports"] = ProxyRequestHandler;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
