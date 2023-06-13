import {
  Commitment,
  Connection,
  clusterApiUrl,
  type Cluster
} from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ClockworkProvider } from "@clockwork-xyz/sdk";

import dotenv from 'dotenv'
import { initializeSolSignerKeypair } from "./initializeKeypair";
dotenv.config()


export function setClockworkProvider (cluster: Cluster, commitment?: Commitment) {
  const connection = new Connection(clusterApiUrl(cluster), commitment);
  const payer = initializeSolSignerKeypair()

  // Prepare clockworkProvider
  const provider = new AnchorProvider(
    connection,
    new NodeWallet(payer),
    AnchorProvider.defaultOptions()
  );
  const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

  return clockworkProvider

}