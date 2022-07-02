import { KeyPair } from 'tonweb-mnemonic';
import { WalletV3ContractR1 } from "tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1";
import { Address } from 'tonweb/dist/types/utils/address';

import { tonWeb } from './config/tonWeb'

class Wallet {
    private readonly keyPair: KeyPair;

    private tonWallet: WalletV3ContractR1;
    private tonAddress: Address;

    constructor(keyPair: KeyPair) {
        this.keyPair = keyPair;
    }

    public async init() {
        this.tonWallet = new tonWeb.wallet.all.v3R2(tonWeb.provider, {
            publicKey: this.keyPair.publicKey,
        });
        this.tonAddress = await this.tonWallet.getAddress();
    }

    public getTonAddress() {
        return this.tonAddress;
    }

    public getTonWallet() {
        return this.tonWallet;
    }
}

export default Wallet;
