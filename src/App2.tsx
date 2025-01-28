import { useState } from 'react'
import { Wallet } from "xrpl"
import { encryptMessage } from './functions/encryptMessage';
import { decryptMessage } from './functions/decryptMessage';
import { Buffer } from 'buffer';

function App2() {
  const [logs, setLogs] = useState([] as string[]);

  const log = (message: string) => {
    setLogs((logs) => [message, ...logs]);
  };

  const run = async () => {
    setLogs([] as string[]);
    log("Started.");

    const someonesPubKey = "EDBBFFB43C7D52DAC676A6CFE9686317916246D0E7D71E9BCAF0435C74DBF70FE7";
    const myPubKey = "EDAB4DAB6263618C42C9C2B8EA3329705DB2B6C37F56918D07489963111AC76BAA";

    const myWallet = Wallet.fromSeed("sEdTkCnxtaveWJVB2yc7zwuCXfrUCiK");
    log("Wallet: " + JSON.stringify(myWallet, null, 2));

    log("Encrypting message...");
    const cypheredMessage = encryptMessage(
      "Hello There",
      myPubKey,
      myWallet.privateKey,
    );
    log("Cyphered message: " + cypheredMessage);

    // log("sending TX...");
    // const result = await sendTX(cypheredMessage, myWallet, receiverPubKey);
    // log("TX result: " + JSON.stringify(result, null, 2));

    log("Receive TX...");
    
    const msg = "7B22656E63727970746564223A224F6D537A6C456D5035363477716C444D4A4663766C4C486C396A47334D6D4143506E664169374C49687354546551673970746F615A4672796637796170524F70417177416D67795530516743222C226E6F6E6365223A22307A5773794D3379644F3867474F525A674D66644B424D786C3641795A46372B227D";

    const receivedMessage = await decryptMessage(Buffer.from(msg, "hex").toString(), someonesPubKey, myWallet.privateKey);
    log("Received message: " + receivedMessage);

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

export default App2
