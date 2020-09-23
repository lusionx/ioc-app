"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./lib/app");
const glob_1 = require("./lib/glob");
const http_1 = require("http");
async function main() {
    let pp = await glob_1.container.getAsync(app_1.HanderApp);
    const server = http_1.createServer(pp.reqHander);
    pp.logger.info('listen http://127.0.0.1:' + pp.config.port);
    server.listen(pp.config.port);
}
process.nextTick(main);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFxQztBQUNyQyxxQ0FBdUM7QUFDdkMsK0JBQW1DO0FBR25DLEtBQUssVUFBVSxJQUFJO0lBQ2YsSUFBSSxFQUFFLEdBQUcsTUFBTSxnQkFBUyxDQUFDLFFBQVEsQ0FBWSxlQUFTLENBQUMsQ0FBQTtJQUN2RCxNQUFNLE1BQU0sR0FBRyxtQkFBWSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN6QyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxDQUFDO0FBRUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQSJ9