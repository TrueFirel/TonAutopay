import TonWeb from "tonweb";
import { BN as BNType } from 'bn.js';
global.Buffer = require('buffer').Buffer;

import Payment from './Payment';
import Client from './Client';
import { configureTonWeb } from './config/tonWeb';

const { BN } = TonWeb.utils;

export interface AutoPayerConfig {
    appMnemonic: string[];
    userMnemonic: string[];
    providerUrl: string;
    apiKey: string;
}

class TonAutoPayer {
    private readonly options: AutoPayerConfig;

    private appClient: Client;
    private userClient: Client;
    private payment: Payment;

    constructor(options: AutoPayerConfig) {
        this.options = options;

        configureTonWeb(this.options);
    }

    async initPayment(userBalance: BNType = new BN(0), appBalance: BNType = new BN(0)) {
        const { userMnemonic, appMnemonic } = this.options;

        this.appClient = new Client(appMnemonic);
        this.userClient = new Client(userMnemonic);

        await Promise.all([this.appClient.init(), this.userClient.init()]);

        const payment = new Payment(this.appClient, appBalance, this.userClient, userBalance);
        await new Promise((resolve) => {
            setTimeout(() => resolve(null), 2000)
        })

        this.payment = payment
        await payment.deploy();

        return this.payment;
    }
}

export default TonAutoPayer;