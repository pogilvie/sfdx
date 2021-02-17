"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const json2object = function (filePath) {
    console.log(filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const r = JSON.parse(data);
    console.log(r);
    return r;
};
exports.default = json2object;
//# sourceMappingURL=json2object.js.map