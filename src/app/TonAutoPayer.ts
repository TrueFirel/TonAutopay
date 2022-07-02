import TonWeb from 'tonweb';
import { BN as BNType } from 'bn.js';

import Payment from './Payment';
import Client from './Client';
import payment from "./Payment";

const { BN } = TonWeb.utils;

export interface AutoPayerConfig {
    appMnemonic: string[];
    userMnemonic: string[];
}

class TonAutoPayer {
    private readonly options: AutoPayerConfig;

    private appClient: Client;
    private userClient: Client;
    private payment: Payment;

    constructor(options: AutoPayerConfig) {
        this.options = options;
    }

    async initPayment(userBalance: BNType = new BN(0), appBalance: BNType = new BN(0)) {
        const { userMnemonic, appMnemonic } = this.options;

        this.appClient = new Client(appMnemonic);
        this.userClient = new Client(userMnemonic);

        await Promise.all([this.appClient.init(), this.userClient.init()]);

        return this.payment = new Payment(this.appClient, appBalance, this.userClient, userBalance);
    }
}

export default TonAutoPayer;