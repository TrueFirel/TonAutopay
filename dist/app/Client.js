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
const tonweb_mnemonic_1 = require("tonweb-mnemonic");
const Wallet_1 = __importDefault(require("./Wallet"));
class Client {
    constructor(mnemonic) {
        this.mnemonic = mnemonic;
    }
    setKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyPair = yield (0, tonweb_mnemonic_1.mnemonicToKeyPair)(this.mnemonic);
        });
    }
    initWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            this.wallet = new Wallet_1.default(this.keyPair);
            yield this.wallet.init();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setKeyPair();
            yield this.initWallet();
        });
    }
    getWallet() {
        return this.wallet;
    }
    getKeyPair() {
        return this.keyPair;
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map