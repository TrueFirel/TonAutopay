import TonWeb from "tonweb";

import TonAutoPayer from './app/TonAutoPayer';
import { configureTonWeb } from './app/config/tonWeb';

const { BN, toNano } = TonWeb.utils;


const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const apiKey = 'a9d1d5e7297e162b94f99e10ebb6a18b1ac6405436744600df85fc9425297e63';
const appMnemonic = ['deputy', 'pizza', 'birth', 'have', 'cage', 'mouse', 'couch', 'usage', 'endorse', 'screen', 'walk', 'pear', 'electric', 'broom', 'cream', 'payment', 'stadium', 'check', 'aerobic', 'bus', 'shoulder', 'grace', 'submit', 'dragon'];
const userMnemonic = ['candy', 'fun', 'wrap', 'once', 'tongue', 'glass', 'organ', 'liar', 'object', 'benefit', 'scrap', 'luxury', 'slot', 'undo', 'cement', 'expand', 'omit', 'attitude', 'deny', 'holiday', 'trick', 'toast', 'unaware', 'humble'];

const init = async () => {
    configureTonWeb({ providerUrl, apiKey })

    const autoPayer = new TonAutoPayer({
        appMnemonic,
        userMnemonic,
    });

    const payment = await autoPayer.initPayment(toNano('2'), toNano('1'));
    // await payment.deploy();
    // await payment.pay(toNano('0.5'));
    // await payment.pay(toNano('0.6'));
    // await payment.terminate();
}

init();