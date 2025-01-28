import * as xrpl from "xrpl";

export const enableRippling = async ({ wallet, client }: { wallet: xrpl.Wallet, client: xrpl.Client }) => {
  const accountSet: xrpl.AccountSet = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
  };

  const prepared = await client.autofill(accountSet);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  return result.result.hash;
}