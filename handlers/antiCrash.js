class antiCrash {

    constructor(client) {
        this.client = client;
    }

    //Exception Handling
    async run(){
        process.on('unhandledRejection', (reason, p) => {
        const stack = reason.stack || "No stack trace available";
        console.error(`[antiCrash] : Unhandled Rejection/Catch \n\nError:\n${reason}\n\nPromise:\n${JSON.stringify(p)}\n\nStack Trace:\n${stack}`);
        });

        process.on("uncaughtException", (err, origin) => {
        const stack = err.stack || "No stack trace available";
        console.error(`[antiCrash] : Uncaught Exception/Catch \n\nError:\n${err}\n\nOrigin:\n${JSON.stringify(origin)}\n\nStack Trace:\n${stack}`);
        });

        process.on('uncaughtExceptionMonitor', (err, origin) => {
        const stack = err.stack || "No stack trace available";
        console.error(`[antiCrash] : Uncaught Exception/Catch \n\nError:\n${err}\nOrigin:\n${JSON.stringify(origin)}\nStack Trace:\n${stack}`);
        });

        process.on('beforeExit', (code) => {
        console.error(`${code}`)
        });

        process.on('exit', (code) => {
        console.error(`${code}`)
        });

        this.client.on("rateLimit", (info) => {
        console.error(`Timeout: ${info.timeout},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.path},\nRoute: ${info.route},\nGlobal: ${info.global}`);
        });
    }
}

module.exports = antiCrash;

/* Made
*  By
*  Discord Id - ashton.gg
*  Credits must be there
*/