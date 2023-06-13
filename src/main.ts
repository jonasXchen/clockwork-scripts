import type { TriggerInput } from '@clockwork-xyz/sdk'
import { setClockworkProvider } from "./scripts/setProvider";
import { initializeSolSignerKeypair } from "./scripts/initializeKeypair";
import { createBurnNftThreadTx } from "./scripts/clockworkThreadTx"
import { PublicKey } from "@solana/web3.js";
import BigNumber from 'bignumber.js';



main().then(() => {
    console.log('Finished successfully')
    console.log(``)
    process.exit(0)
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })

async function main() {
    
    const authority = initializeSolSignerKeypair()
    const clockworkProvider = setClockworkProvider('devnet', 'processed')

    // Set trigger time
    const currentDateTime = new Date(); // Current date and time

    const oneMinLater = new Date(currentDateTime.getTime() + 60000);
    const oneMinLaterTimestamp = Math.floor(oneMinLater.getTime() / 1000);

    const oneDayLater = new Date(currentDateTime.setDate(currentDateTime.getDate() + 1));
    const oneDayLaterTimestamp = Math.floor(oneDayLater.getTime() / 1000);

    const oneMonthLater = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate());
    const oneMonthLaterTimestamp = Math.floor(oneMonthLater.getTime() / 1000);

    const trigger : TriggerInput = {
        timestamp: {
            unix_ts: new BigNumber(oneMinLaterTimestamp)
        }
        // cron: {
        //     schedule: "1 0 * * *", // min(0-59) hour(0-23) dayOfMonth(1-31) month(1-12) dayOfWeek(0-6)
        //     skippable: false //   Scheduled invocation can be skipped if the Solana network is unavailable. If false, any missed invocations will be executed as soon as the Solana network is online. 
        // }
    }
    const mint = new PublicKey("2QZfyaZ5VPYNsNL4TvsgSRAFrzxK3t9RssJUsXHJV9or")
    const ata = new PublicKey("CPbrA95v3deetmbdCocTxnwAJmqJdm2w8B3z4P3pLgyk")
    const owner = new PublicKey("BRLwFQMYVMnqxvTn5CZ2b9Zgpz8ZKgf3XnUygEoNAapa")

    const tx = await createBurnNftThreadTx(clockworkProvider, trigger, mint, ata, owner, authority)
    const sig = await clockworkProvider.anchorProvider.sendAndConfirm(tx);
    console.log(`Thread created: https://solscan.io/tx/${sig}?cluster=devnet`);



}

