import * as xrpl from "xrpl";

export const createToken = async ({ issuer, receiver, client, tokenCode }
    : { issuer: xrpl.Wallet, receiver: xrpl.Wallet, client: xrpl.Client, tokenCode: string }
) => {
    // Create the trust line to send the token
    const trustSet: xrpl.TrustSet = {
        TransactionType: "TrustSet",
        Account: receiver.address,
        LimitAmount: {
            currency: tokenCode,
            issuer: issuer.address,
            value: "500000000", // 500M tokens
        },
        Flags: xrpl.TrustSetFlags.tfClearNoRipple,
    };
    console.log(trustSet);

    // Receiver opening trust lines
    const preparedTrust = await client.autofill(trustSet);
    const signedTrust = receiver.sign(preparedTrust);
    const resultTrust = await client.submitAndWait(signedTrust.tx_blob);

    console.log(resultTrust);
    console.log("Trust line issuance tx result: ", resultTrust.result.hash);

    // Send the token to the receiver
    const sendPayment: xrpl.Payment = {
        TransactionType: "Payment",
        Account: issuer.address,
        Destination: receiver.address,
        Amount: {
            currency: tokenCode,
            issuer: issuer.address,
            value: "200000000", // 200M tokens
        },
    };
    console.log(sendPayment);

    const preparedPayment = await client.autofill(sendPayment);
    const signedPayment = issuer.sign(preparedPayment);
    const resultPayment = await client.submitAndWait(signedPayment.tx_blob);

    console.log(resultPayment);
    console.log("Transfer issuance tx result: ", resultPayment.result.hash);

    return resultPayment.result.hash;
}