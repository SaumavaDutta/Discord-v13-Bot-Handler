const fs = require("fs");
class Commands {
    constructor(client) {
        this.client = client;
    }
    //Commands Loading
    load() {
    try {
        const path = fs.readdirSync(`${process.cwd()}/commands/`);
        if (path.length > 0) {
            path.forEach((dir, i) => {
                fs.stat(`${process.cwd()}/commands/`, (err, stats) => {
                    if (err) {
                        this.client.logger.log(err, { type: this.client.constants.rErr });
                        return;
                    }
                    if (stats.isDirectory()) {
                        let files = fs.readdirSync(`${process.cwd()}/commands/${dir}/`);
                        files = files.filter(f => f.endsWith(".js"));
                        for (const file of files) {
                            const Command = require(`${process.cwd()}/commands/${dir}/${file}`);
                            try {
                            const command = new Command(this.client);
                            this.client.commands.set(command.name, command);
                            if (command?.aliases && command?.aliases?.length > 0) {
                                command?.aliases.forEach((alias) => {
                                    this.client.aliases.set(alias, command.name);
                                });
                            }
                            } catch (e) {
                                this.client.logger.log("Command class isn't exported.");
                        }
                        }
                    }
                });
            });
        console.log("All the commands have been loaded.")
        }
    } catch (e) {
        return this.client.logger.log(e, { type: this.client.constants.err });
    }
    }
}

module.exports = Commands;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/