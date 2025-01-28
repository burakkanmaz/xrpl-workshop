import tweetnacl from 'tweetnacl';
import {
    edwardsToMontgomeryPub,
    edwardsToMontgomeryPriv,
} from "@noble/curves/ed25519";
import { Buffer } from 'buffer';

const { box } = tweetnacl;

export const decryptMessage = (
    messageWithNonce: string,
    recipientPublicKey: string,
    senderSecretKey: string,
): string => {
    const pubKeyBytes = Buffer.from(recipientPublicKey.slice(2), "hex");
    const secretKeyBytes = Buffer.from(senderSecretKey.slice(2), "hex");

    const pubKeyCurve = edwardsToMontgomeryPub(pubKeyBytes);
    const privKeyCurve = edwardsToMontgomeryPriv(secretKeyBytes);
    console.log(messageWithNonce)
    const { encrypted, nonce } = JSON.parse(messageWithNonce);
    const messageBytes = Buffer.from(encrypted, "base64");
    const nonceBytes = Buffer.from(nonce, "base64");
    const decryptedMessage = box.open(
        messageBytes,
        nonceBytes,
        pubKeyCurve,
        privKeyCurve,
    );
    if (!decryptedMessage) {
        throw new Error("Failed to decrypt message");
    }
    return new TextDecoder().decode(decryptedMessage);
}