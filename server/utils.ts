import { Xumm } from "xumm";
import { Wallet, Client } from 'xrpl';

export function getXumm() {
    const runtimeConfig = useRuntimeConfig()

    const xumm = new Xumm(
        runtimeConfig.xamanApiKey,
        runtimeConfig.xamanSecretKey,
    );
    return xumm;
}

export function getWallet() {
    const runtimeConfig = useRuntimeConfig()
    const wallet = Wallet.fromSeed(runtimeConfig.xrplCommonsSecret);

    // console.log(`Wallet address: ${wallet.address}`);
    // console.log(`Wallet public key: ${wallet.publicKey}`);
    // console.log(`Wallet private key: ${wallet.privateKey}`);
    return wallet
}

export async function getExplorerClient() {
    const runtimeConfig = useRuntimeConfig()
    const client = new Client(runtimeConfig.wssExplorer);
    await client.connect();
    return client;
}

export function textToHex(text: string) {
    let hexString = '';
    for (let i = 0; i < text.length; i++) {
        hexString += text.charCodeAt(i).toString(16);
    }
    return hexString;
}