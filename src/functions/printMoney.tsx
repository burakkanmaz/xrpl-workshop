import * as xrpl from "xrpl";

export const printMoney = async ({ destinationWallet, client }: { destinationWallet: xrpl.Wallet, client: xrpl.Client }) => {
    const { wallet: wallet1 } = await client.fundWallet();

    console.log("wallet1", wallet1);

    const tx: xrpl.Payment = {
        TransactionType: "Payment",
        Account: wallet1.classicAddress,
        Destination: destinationWallet.classicAddress,
        Amount: xrpl.xrpToDrops("90"),
    };

    await client.submitAndWait(tx, {
        autofill: true,
        wallet: wallet1,
    });
};