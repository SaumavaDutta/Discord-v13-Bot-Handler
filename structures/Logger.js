class Logger {
    constructor(client) {
        this.client = client;
    }
     log(content, error) {
        if (error?.type) throw new error.type(content);
        return console.log(content);
    }
}
module.exports = Logger;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
