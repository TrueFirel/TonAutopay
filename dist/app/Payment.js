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
const tonWeb_1 = require("./config/tonWeb");
const { BN, toNano } = tonweb_1.default.utils;
const DEFAULT_TRANSACTION_FEE = '0.05';
//should be replaced with storing and incrementing on the server side to avoid channel collision
const CHANNEL_ID = 167;
class Payment {
    constructor(appClient, appBalance, userClient, userBalance) {
        this.appClient = appClient;
        this.userClient = userClient;
        this.state = {
            balanceA: userBalance,
            balanceB: appBalance,
            seqnoA: new BN(0),
            seqnoB: new BN(0),
        };
        this.config = {
            channelId: new BN(CHANNEL_ID),
            addressA: userClient.getWallet().getTonAddress(),
            addressB: appClient.getWallet().getTonAddress(),
            initBalanceA: this.state.seqnoA,
            initBalanceB: this.state.seqnoB,
        };
        this.setup();
    }
    setup() {
        this.userChannelController = new ChannelController(this.userClient.getWallet(), this.userClient.getKeyPair().secretKey, Object.assign(Object.assign({}, this.config), { isA: true, myKeyPair: this.userClient.getKeyPair(), hisPublicKey: this.appClient.getKeyPair().publicKey }));
        this.appChannelController = new ChannelController(this.appClient.getWallet(), this.appClient.getKeyPair().secretKey, Object.assign(Object.assign({}, this.config), { isA: false, myKeyPair: this.appClient.getKeyPair(), hisPublicKey: this.userClient.getKeyPair().publicKey }));
    }
    deploy(userTransactionFee = toNano(DEFAULT_TRANSACTION_FEE)) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateChannels();
            yield this.userChannelController.getMessageStream().deploy(userTransactionFee);
            yield this.topUp(userTransactionFee);
        });
    }
    validateChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            const appChannelAddress = yield this.appChannelController.getAddress();
            const userChannelAddress = yield this.userChannelController.getAddress();
            if (appChannelAddress.toString() !== userChannelAddress.toString()) {
                throw new Error('Channels address not same');
            }
        });
    }
    topUp(fee) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMessageSender = this.userChannelController.getMessageStream().getMessageSender();
            yield userMessageSender
                .topUp({ coinsA: this.state.balanceA, coinsB: new BN(0) })
                .send(state.balanceA.add(toNano(fee)));
            yield userMessageSender
                .init(this.state)
                .send(toNano(fee));
        });
    }
}
class ChannelController {
    constructor(wallet, secretKey, config) {
        // @ts-ignore
        this.channel = tonWeb_1.tonWeb.payments.createChannel(config);
        this.messageStream = new MessageStream(this.channel, wallet.getTonWallet(), secretKey);
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getAddress();
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getData();
        });
    }
    getMessageStream() {
        return this.messageStream;
    }
}
class MessageStream {
    constructor(channel, wallet, secretKey) {
        this.messageSender = channel.fromWallet({ wallet, secretKey });
    }
    deploy(transactionFee) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageSender.deploy().send(transactionFee);
        });
    }
    getMessageSender() {
        return this.messageSender;
    }
}
exports.default = Payment;
//# sourceMappingURL=Payment.js.map