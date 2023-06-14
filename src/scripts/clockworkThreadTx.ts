import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createBurnInstruction,
  createThawAccountInstruction
} from "@solana/spl-token";

import { ClockworkProvider, TriggerInput } from "@clockwork-xyz/sdk";


export async function createBurnNftThreadTx(clockworkProvider: ClockworkProvider, trigger: TriggerInput, mint: PublicKey, owner: PublicKey, authority: Keypair, programId: PublicKey = TOKEN_PROGRAM_ID) {


  // 1️⃣  Create threadId
  const threadId = "burnNft" + new Date().getTime();
  const [thread] = clockworkProvider.getThreadPDA(
  authority.publicKey,  // thread authority
  threadId                    // thread id
  );
  console.log(`Thread id: ${threadId}, address: ${thread}`);


  // 2️⃣  Build the Instruction
  const [ata, bump] = PublicKey.findProgramAddressSync([mint.toBuffer()], programId) 
  const unfreezeNftIx = createThawAccountInstruction(ata, mint, owner, undefined, programId) // Unfreeze NFT
  const burnNftIx = createBurnInstruction(ata, mint, owner, 1, undefined, programId) // burn NFT
  const deleteThreadIx = await clockworkProvider.threadDelete(authority.publicKey, thread);  // delete Thread
  
  // 3️⃣  Create the thread.
  const ix = await clockworkProvider.threadCreate(
    authority.publicKey,    // authority
    threadId,                     // id
    [unfreezeNftIx, burnNftIx, deleteThreadIx],                   // instructions to execute
    trigger,                      // trigger condition
    0.005 * LAMPORTS_PER_SOL      // amount to fund the thread with for execution fees
  );

  const tx = new Transaction().add(ix);

  return tx

}

