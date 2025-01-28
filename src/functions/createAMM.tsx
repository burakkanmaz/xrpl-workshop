import * as xrpl from "xrpl";

export const createAMM = async ({ issuer, receiver, client, tokenCode }:
    { issuer: xrpl.Wallet, receiver: xrpl.Wallet, client: xrpl.Client, tokenCode: string }
) => {
    console.log("create AMM", { issuer, receiver, tokenCode });
    const createAmm: xrpl.AMMCreate = {
        TransactionType: "AMMCreate",
        Account: receiver.address,
        TradingFee: 600,
        Amount: {
            currency: tokenCode,
            issuer: issuer.classicAddress,
            value: "2000000", // 2M tokens
        },
        Amount2: "50000000", // 50 XRP in drops
    };
    console.log(createAmm);

    const prepared = await client.autofill(createAmm);
    const signed = receiver.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    console.log(result);
    console.log("Create amm tx: ", result.result.hash);

    return result.result.hash;
}