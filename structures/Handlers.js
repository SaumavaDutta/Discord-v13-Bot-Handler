const fs = require("fs");
class Handlers {
    constructor(client) {
        this.client = client;
    }
    //Handlers Loading
    load() {
        try {
        const path = fs.readdirSync(`${process.cwd()}/handlers/`);
        const file = path.filter(a => a.endsWith(".js"));
        if (file.length > 0) {
            path.forEach((f, i) => {
                const Handler = require(`${process.cwd()}/handlers/${f}`);
                new Handler(this.client).run();
            });
            console.log("All the handlers have been loaded.")
        }
    } catch (e) {
        return this.client.logger.log(e, { type: this.client.constants.err });
    }
    }
}
module.exports = Handlers;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
