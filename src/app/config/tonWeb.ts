import TonWeb from 'tonweb';

export interface Options {
    providerUrl: string;
    apiKey: string;
}

export let tonWeb: TonWeb;

export const configureTonWeb = ({ providerUrl, apiKey }: Options) => {
    tonWeb = new TonWeb(new TonWeb.HttpProvider(providerUrl, { apiKey }));
}