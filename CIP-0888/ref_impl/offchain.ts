import { Blockfrost, fromHex } from "lucid-cardano";
import cbor from 'borc';
import { Buffer } from 'buffer';

function parseBuffer(buffer: Buffer): string {
    try {
        // Convert the buffer to a UTF-8 string and back to a buffer
        const decodedString = buffer.toString('utf8');
        const reEncodedBuffer = Buffer.from(decodedString, 'utf8');
        // Compare the original buffer with the re-encoded buffer
        return buffer.equals(reEncodedBuffer) ? decodedString : buffer.toString('hex');
    } catch (error) {
        // If an error occurs during conversion, it's not a valid UTF-8
        return buffer.toString('hex');
    }
}

// Function to recursively extract and convert CBOR data
function convertCBORData(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertCBORData);
    } else if (typeof obj === 'object') {
        if (obj instanceof Buffer) {
            return parseBuffer(obj);
        } else if (obj.hasOwnProperty('value') && obj.hasOwnProperty('tag')) {
            // Handle specific tags
            if (obj.tag === 121) {
                return convertCBORData(obj.value);
            }
        } else if (obj instanceof Map){
            const result: Record<string, any> = {};
            for (const [key, value] of obj) {
                result[parseBuffer(key)] = convertCBORData(value);
            }
            return result;
        } else {
            return obj;
        }
    } else {
        return obj;
    }
}
const network = "preview";
const provider = new Blockfrost(
    https://cardano-${network}.blockfrost.io/api/v0,
    "preview..."
);
const address = "addr_test1wrxyj53tu99rwk7ujwxng5fuwcnj08j7le8g4nu94nd5plqyj6red"; // Soulbound SC address
const utxos = await provider.getUtxos(address);
const datums = utxos.filter(utxo => !!utxo.datum).map(utxo => utxo.datum) as string[];
const metadata = datums.map(datum => {
    // datum pattern: [policyHash, beneficiary, status, metadata]
    const decodedData = cbor.decode(new Uint8Array(fromHex(datum)));
    const [policyHash, beneficiary, status, [metadata, version, extra]] = convertCBORData(decodedData);
    return {policyHash, beneficiary, status, metadata, version, extra};
});

console.log("Soulbound Metadata", JSON.stringify(metadata, null, 2))