const fs = require("fs");
class Events {
    constructor(client) {
        this.client = client;
    }
    //Events Loading
    load() {
        try {
        const path = fs.readdirSync(`${process.cwd()}/events/`);
        const file = path.filter(a => a.endsWith(".js"));
        if (file.length > 0) {
            path.forEach((f, i) => {
                const Event = require(`${process.cwd()}/events/${f}`);
                const event = new Event(this.client);
                this.client.on(f.split(".")[0], async (...listen) => {
                    event.run(...listen);
                });
            });
            console.log("All the events have been loaded.")
        }
    } catch (e) {
        return this.client.logger.log(e, { type: this.client.constants.err });
    }
    }
}
module.exports = Events;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
