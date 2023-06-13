import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createBurnInstruction
} from "@solana/spl-token";

import { ClockworkProvider, TriggerInput } from "@clockwork-xyz/sdk";


export async function createBurnNftThreadTx(clockworkProvider: ClockworkProvider, trigger: TriggerInput, mint: PublicKey, ata: PublicKey, owner: PublicKey, authority: Keypair) {

  // 1️⃣ Build the Instruction
  const burnNftIx = createBurnInstruction(ata, mint, owner, 1, undefined, TOKEN_PROGRAM_ID)

  // 2️⃣  Create threadId
  const threadId = "burnNft" + new Date().getTime();
  const [thread] = clockworkProvider.getThreadPDA(
  authority.publicKey,  // thread authority
  threadId                    // thread id
  );
  console.log(`Thread id: ${threadId}, address: ${thread}`);


  // 3️⃣  Create the thread.
  const ix = await clockworkProvider.threadCreate(
    authority.publicKey,    // authority
    threadId,                     // id
    [burnNftIx],                   // instructions to execute
    trigger,                      // trigger condition
    0.005 * LAMPORTS_PER_SOL      // amount to fund the thread with for execution fees
  );

  const tx = new Transaction().add(ix);
  
  // Delete Thread
  const deleteThreadIx = await clockworkProvider.threadDelete(authority.publicKey, thread);
  tx.add(deleteThreadIx);

  return tx

}

