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
Object.defineProperty(exports, "__esModule", { value: true });
const tonWeb_1 = require("./config/tonWeb");
class Wallet {
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tonWallet = new tonWeb_1.tonWeb.wallet.all.v3R2(tonWeb_1.tonWeb.provider, {
                publicKey: this.keyPair.publicKey,
            });
            this.tonAddress = yield this.tonWallet.getAddress();
        });
    }
    getTonAddress() {
        return this.tonAddress;
    }
    getTonWallet() {
        return this.tonWallet;
    }
}
exports.default = Wallet;
//# sourceMappingURL=Wallet.js.map