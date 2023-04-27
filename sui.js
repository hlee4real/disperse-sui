const { Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock, testnetConnection} = require('@mysten/sui.js')
require('dotenv').config()
let privateKey = process.env.PK
const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(privateKey.slice(2), "hex"));

const provider = new JsonRpcProvider(testnetConnection);
const signer = new RawSigner(keypair, provider);
const packageObjectId = process.env.PACKAGEID

const tx = new TransactionBlock();

const call = async () => {
    try {
        //set gas budget for the tx
        tx.setGasBudget(10000000)
        //get signer's address
        const address = (await signer.getAddress()).toString()
        //get sui coin's objectId from signer's address
        const objectId = await getobject(address)
        //make sui coin object
        const coin = tx.object(objectId);
        tx.moveCall({
            target: `${packageObjectId}::disperse::disperse`,
            typeArguments: ["0x2::sui::SUI"],
            arguments: [
                coin,
                tx.pure([10000000,10000000,10000000]),
                tx.pure(['0x95793afda716d5b3f5ba9bbe828e8235f4b9a162c52298a0ecf801b79860b713', '0xba36dcc5f1ff040881ad3c767d69fc849d1384676a57d2503006cc744dc5c2b0', '0x96746b7f2dbf193ef21b1166066c619fa74452fe416bf6eced7dc8fb0daf2670']),
            ],
        });
        const result = await signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
        });
        console.log({ result });
    } catch (error) {
        console.log(error);
    }
}

const getobject = async (address) => {
    try {
        const result = await provider.getOwnedObjects({owner: address})
        return result.data[0].data.objectId
    } catch (error) {
        console.log(error);
    }
}

const main = async () => {
    await call()
}

main()