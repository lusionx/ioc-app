"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const tslib_1 = require("tslib");
const glob_1 = require("../lib/glob");
const injection_1 = require("injection");
const fs = require("fs");
const path_1 = require("path");
let AppConfig = class AppConfig {
    async init() {
        const env = process.env['NODE_ENV'] || 'local';
        const txt = await new Promise((res, rej) => {
            fs.readFile(path_1.dirname(__filename) + `/config.${env}.json`, { encoding: 'utf8' }, (err, data) => {
                err ? rej(err) : res(data);
            });
        });
        Object.assign(this, JSON.parse(txt));
    }
};
tslib_1.__decorate([
    injection_1.init(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AppConfig.prototype, "init", null);
AppConfig = tslib_1.__decorate([
    injection_1.provide()
], AppConfig);
exports.AppConfig = AppConfig;
glob_1.container.bind(AppConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsc0NBQXVDO0FBQ3ZDLHlDQUF5QztBQUN6Qyx5QkFBd0I7QUFDeEIsK0JBQThCO0FBRzlCLElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVM7SUFjbEIsS0FBSyxDQUFDLElBQUk7UUFDTixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQTtRQUM5QyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQy9DLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFdBQVcsR0FBRyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3pGLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDOUIsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0NBQ0osQ0FBQTtBQVRHO0lBREMsZ0JBQUksRUFBRTs7OztxQ0FTTjtBQXRCUSxTQUFTO0lBRHJCLG1CQUFPLEVBQUU7R0FDRyxTQUFTLENBdUJyQjtBQXZCWSw4QkFBUztBQXdCdEIsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUEifQ==