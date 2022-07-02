"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureTonWeb = exports.tonWeb = void 0;
const tonweb_1 = __importDefault(require("tonweb"));
const configureTonWeb = ({ providerUrl, apiKey }) => {
    exports.tonWeb = new tonweb_1.default(new tonweb_1.default.HttpProvider(providerUrl, { apiKey }));
};
exports.configureTonWeb = configureTonWeb;
//# sourceMappingURL=tonWeb.js.map