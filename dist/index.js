"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniBump = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const package_json_1 = require("../package.json");
class UniBump extends forgescript_1.ForgeExtension {
    name = 'UniBump Utils';
    description = 'A forgescript extension that allows you to view Minecraft Server Statistics';
    version = package_json_1.version;
    init() {
        this.load(__dirname + '/functions');
    }
    ;
}
exports.UniBump = UniBump;
;
//# sourceMappingURL=index.js.map