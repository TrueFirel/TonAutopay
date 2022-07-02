"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tonweb_1 = __importDefault(require("tonweb"));
const Payment_1 = __importDefault(require("./Payment"));
const Client_1 = __importDefault(require("./Client"));
const { BN } = tonweb_1.default.utils;
class TonAutoPayer {
    constructor(options) {
        this.options = options;
    }
    initPayment(userBalance = new BN(0), appBalance = new BN(0)) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userMnemonic, appMnemonic } = this.options;
            this.appClient = new Client_1.default(appMnemonic);
            this.userClient = new Client_1.default(userMnemonic);
            yield Promise.all([this.appClient.init(), this.userClient.init()]);
            return this.payment = new Payment_1.default(this.appClient, appBalance, this.userClient, userBalance);
        });
    }
}
exports.default = TonAutoPayer;
//# sourceMappingURL=TonAutoPayer.js.map