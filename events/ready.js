class ready {
    constructor(client) {
        this.client = client;
    }
    async run() {
        //ready message
        this.client.logger.log(`Sucessfully logged into ${this.client.user.tag}`)
    }
}
module.exports = ready;

/* Made
*  By
*  Discord Id - Saumava
*  Credits must be there
*/
