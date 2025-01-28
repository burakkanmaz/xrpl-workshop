import { Buffer } from "buffer";
import { Client, Wallet, deriveAddress, Payment } from "xrpl";

export const sendTX = async (
    cypherMessage: string,
    myWallet: Wallet,
    recipientPublicKey: string,
) => {
    const client = new Client("wss://clio.altnet.rippletest.net:51233/");
    try {
        await client.connect();
        const receiverAddress = deriveAddress(recipientPublicKey);
        console.log(receiverAddress)

        const tx: Payment = {
            TransactionType: "Payment",
            Account: myWallet.classicAddress,
            Destination: receiverAddress,
            Amount: "1",
            Memos: [
                {
                    Memo: {
                        MemoData: Buffer.from(cypherMessage).toString("hex"),
                    },
                },
            ],
        };

        const prepared = await client.autofill(tx);
        const signed = myWallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        return result;
    } catch (error) {
        console.log(error);
    } finally {
        await client.disconnect();
    }
}