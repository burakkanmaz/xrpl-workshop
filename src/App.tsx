import { useState } from 'react'
import * as xrpl from 'xrpl'
import { printMoney } from './functions/printMoney';
import { createToken } from './functions/createToken';
import { enableRippling } from './functions/enableRippling';
import { createAMM } from './functions/createAMM';
import { convertStringToHexPadded } from './functions/convertStringToHexPadded';
function App() {
  const [logs, setLogs] = useState([] as string[]);
  const client = new xrpl.Client("wss://testnet.xrpl-labs.com");
  const tokenName = "BPT";

  const log = (message: string) => {
    setLogs((logs) => [message, ...logs]);
  };

  const run = async () => {
    setLogs([] as string[]);
    log("Started.");

    log("Connecting to XRPL...");
    await client.connect();
    log("Connected.");

    log("Wallets from seed...");

    // const newWallet1 = xrpl.Wallet.generate();
    // const newWallet2 = xrpl.Wallet.generate();
    // log("New Wallet1: " + JSON.stringify(newWallet1, null, 2));
    // log("New Wallet2: " + JSON.stringify(newWallet2, null, 2));

    const issuer = await xrpl.Wallet.fromSeed("sEdV9cnSZ9tKQsMUkG6GQya72ATUSAH");
    const receiver = await xrpl.Wallet.fromSeed("sEdTkCnxtaveWJVB2yc7zwuCXfrUCiK");
    log("Wallet1: " + JSON.stringify(issuer, null, 2));
    log("Wallet2: " + JSON.stringify(receiver, null, 2));

    log("Printing money...");
    await printMoney({ destinationWallet: receiver, client });

    log("Getting balances...");
    const balances1 = await client.getBalances(issuer.classicAddress);
    const balances2 = await client.getBalances(receiver.classicAddress);
    log("Wallet1 balances: " + JSON.stringify(balances1, null, 2));
    log("Wallet2 balances: " + JSON.stringify(balances2, null, 2));

    log("Enabling rippling...");
    const hash = await enableRippling({ wallet: issuer, client });
    log("Enabled rippling. Hash: " + hash);

    log("Creating token...");
    const tokenHash = await createToken({ issuer, receiver, client, tokenCode: convertStringToHexPadded(tokenName) });
    log("Created token. Hash: " + tokenHash);

    log("Creating AMM...");
    const ammHash = await createAMM({ issuer, receiver, client, tokenCode: convertStringToHexPadded(tokenName) });
    log("Created AMM. Hash: " + ammHash);

    log("Disconnecting from XRPL...");
    await client.disconnect();

    log("Finished.");
  };

  return (
    <>
      <button onClick={run} >
        Run
      </button>
      <h2>Logs</h2>
      <div className="scrollable-logs">
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <pre>
                {log}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
