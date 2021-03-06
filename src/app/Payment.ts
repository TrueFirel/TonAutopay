import TonWeb from 'tonweb';
import { BN as BNType } from 'bn.js';
import { KeyPair } from 'tonweb-mnemonic';

import { Address } from 'tonweb/dist/types/utils/address';
import { WalletV3ContractR1 } from "tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1";

import { tonWeb } from './config/tonWeb';

import Client from './Client';
import Wallet from './Wallet';

const { BN, toNano } = TonWeb.utils;

const DEFAULT_TRANSACTION_FEE = '0.05';

interface ChannelState {
    balanceA: BNType;
    balanceB: BNType;
    seqnoA: BNType;
    seqnoB: BNType;
}

interface InitialChannelConfig {
    channelId: BNType;
    addressA: Address;
    addressB: Address;
    initBalanceA: ChannelState['balanceA'];
    initBalanceB: ChannelState['balanceB'];
}

interface ChannelConfig extends InitialChannelConfig {
    isA: boolean,
    myKeyPair: KeyPair,
    hisPublicKey: Uint8Array,
}

//should be replaced with storing and incrementing on the server side to avoid channel collision
const CHANNEL_ID = ~~(Date.now() / 1000);

class Payment {
    private appClient: Client;
    private userClient: Client;
    private appChannelController: ChannelController;
    private userChannelController: ChannelController;
    private state: ChannelState;
    private config: InitialChannelConfig;

    constructor(appClient: Client, appBalance: BNType, userClient: Client, userBalance: BNType) {
        this.appClient = appClient;
        this.userClient = userClient;
        this.state = {
            balanceA: userBalance,
            balanceB: appBalance,
            seqnoA: new BN(1),
            seqnoB: new BN(1),
        }

        this.config = {
            channelId: new BN(CHANNEL_ID),
            addressA: userClient.getWallet().getTonAddress(),
            addressB: appClient.getWallet().getTonAddress(),
            initBalanceA: this.state.balanceA,
            initBalanceB: this.state.balanceB,
        }

        this.setup();
    }

    private async setup() {
        this.userChannelController = new ChannelController(
            this.userClient.getWallet(),
            this.userClient.getKeyPair().secretKey, {
                ...this.config,
                isA: true,
                myKeyPair: this.userClient.getKeyPair(),
                hisPublicKey: this.appClient.getKeyPair().publicKey,
            }
        )

        this.appChannelController = new ChannelController(
            this.appClient.getWallet(),
            this.appClient.getKeyPair().secretKey,
            {
                ...this.config,
                isA: false,
                myKeyPair: this.appClient.getKeyPair(),
                hisPublicKey: this.userClient.getKeyPair().publicKey,
        })
    }

    public async deploy(userTransactionFee: BNType = toNano(DEFAULT_TRANSACTION_FEE)) {
        await this.validateChannels();
        await this.userChannelController.getMessageStream().deploy(userTransactionFee);
        let channelState = -1;
        while (channelState !== 0) {
            try {
                channelState = await this.userChannelController.getChannel().getChannelState();
            } catch (e) {

            }
            await new Promise((resolve) => {
                setTimeout(() => resolve(null), 2000)
            })
        }
        await this.topUp(userTransactionFee);
    }

    private async validateChannels() {
        const appChannelAddress = await this.appChannelController.getChannel().getAddress();
        const userChannelAddress = await this.userChannelController.getChannel().getAddress();

        if (appChannelAddress.toString() !== userChannelAddress.toString()) {
            throw new Error('Channels address not same');
        }
    }

    private async topUp(userTransactionFee: BNType) {
        const userMessageSender = this.userChannelController.getMessageStream().getMessageSender();
        const appMessageSender = this.appChannelController.getMessageStream().getMessageSender();
        const userChannel = this.userChannelController.getChannel();

        const intialBalanceA = (await userChannel.getData()).balanceA.toString()
        const intialBalanceB = (await userChannel.getData()).balanceB.toString()

        await Promise.all([
            userMessageSender
                .topUp({ coinsA: this.state.balanceA, coinsB: new BN(0) })
                .send(this.state.balanceA.add(userTransactionFee)),
            appMessageSender
                .topUp({ coinsA: new BN(0), coinsB: this.state.balanceB })
                .send(this.state.balanceB.add(userTransactionFee))
        ])

        let balanceA = intialBalanceA;
        let balanceB = intialBalanceB;

        while (balanceA === intialBalanceA || balanceB === intialBalanceB) {
            balanceA = (await userChannel.getData()).balanceA.toString();
            balanceB = (await userChannel.getData()).balanceB.toString();
            await new Promise((resolve) => {
                setTimeout(() => resolve(null), 2000)
            })
        }

        const initialChannelState = await userChannel.getChannelState()
        await userMessageSender
            .init(this.state)
            .send(userTransactionFee);

        let channelState = initialChannelState
        while (channelState === initialChannelState) {
            channelState = await userChannel.getChannelState();
            await new Promise((resolve) => {
                setTimeout(() => resolve(null), 2000)
            })
        }
    }

    public async pay(amount: BNType) {
        const userChannel = this.userChannelController.getChannel();
        const appChannel = this.appChannelController.getChannel();

        this.state = {
            ...this.state,
            balanceA: this.state.balanceA.sub(amount),
            balanceB: this.state.balanceB.add(amount),
            seqnoA: this.state.seqnoA.add(new BN(1)),
        }

        const newUserStateSignature = await userChannel.signState(this.state);

        if (!(await appChannel.verifyState(this.state, newUserStateSignature))) {
            throw new Error('Invalid user signature');
        }

        await appChannel.signState(this.state);
    }

    public async terminate(userTransactionFee: BNType = toNano('0.05')) {
        const userChannel = this.userChannelController.getChannel();
        const appChannel = this.appChannelController.getChannel();
        const userMessageSender = this.userChannelController.getMessageStream().getMessageSender()

        const appCloseSignature = await appChannel.signClose(this.state);

        const verify = await userChannel.verifyClose(this.state, appCloseSignature);
        if (!verify) {
            throw new Error('Invalid user signature');
        }
        await userMessageSender.close({
            ...this.state,

            hisSignature: appCloseSignature
        }).send(userTransactionFee);
    }
}

class ChannelController {
    private readonly channel: Record<string, any>;
    private messageStream: MessageStream;

    constructor(wallet: Wallet, secretKey: Uint8Array, config: ChannelConfig) {
        // @ts-ignore
        this.channel = tonWeb.payments.createChannel(config);

        this.messageStream = new MessageStream(this.channel, wallet.getTonWallet(), secretKey);
    }

    public getChannel() {
        return this.channel;
    }

    public getMessageStream() {
        return this.messageStream;
    }
}

class MessageStream {
    private messageSender: Record<string, any>;

    constructor(channel: Record<string, any>, wallet: WalletV3ContractR1, secretKey: Uint8Array) {
        this.messageSender = channel.fromWallet({ wallet, secretKey });
    }

    public async deploy(transactionFee: BNType) {
        await this.messageSender.deploy().send(transactionFee);
    }

    public getMessageSender() {
        return this.messageSender;
    }
}

export default Payment;