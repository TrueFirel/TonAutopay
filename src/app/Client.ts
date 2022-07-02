import TonWeb from 'tonweb';
import { KeyPair, mnemonicToKeyPair } from 'tonweb-mnemonic';

import Wallet from './Wallet';

class Client {
    private readonly mnemonic: string[];

    private wallet: Wallet;
    private keyPair: KeyPair;

    constructor(mnemonic: string[]) {
        this.mnemonic = mnemonic;
    }

    private async setKeyPair() {
        this.keyPair = await mnemonicToKeyPair(this.mnemonic);
    }

    private async initWallet() {
        this.wallet = new Wallet(this.keyPair);

        await this.wallet.init();
    }

    public async init() {
        await this.setKeyPair();
        await this.initWallet();
    }

    public getWallet() {
        return this.wallet;
    }

    public getKeyPair() {
        return this.keyPair;
    }
}

export default Client;
