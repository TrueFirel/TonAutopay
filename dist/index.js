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
const TonAutoPayer_1 = __importDefault(require("./app/TonAutoPayer"));
const tonWeb_1 = require("./app/config/tonWeb");
const { BN } = tonweb_1.default.utils;
const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const apiKey = 'a9d1d5e7297e162b94f99e10ebb6a18b1ac6405436744600df85fc9425297e63';
const appMnemonic = ['deputy', 'pizza', 'birth', 'have', 'cage', 'mouse', 'couch', 'usage', 'endorse', 'screen', 'walk', 'pear', 'electric', 'broom', 'cream', 'payment', 'stadium', 'check', 'aerobic', 'bus', 'shoulder', 'grace', 'submit', 'dragon'];
const userMnemonic = ['candy', 'fun', 'wrap', 'once', 'tongue', 'glass', 'organ', 'liar', 'object', 'benefit', 'scrap', 'luxury', 'slot', 'undo', 'cement', 'expand', 'omit', 'attitude', 'deny', 'holiday', 'trick', 'toast', 'unaware', 'humble'];
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, tonWeb_1.configureTonWeb)({ providerUrl, apiKey });
    const autoPayer = new TonAutoPayer_1.default({
        appMnemonic,
        userMnemonic,
    });
    const payment = yield autoPayer.initPayment(new BN(0));
    yield payment.deploy();
});
init();
//# sourceMappingURL=index.js.map