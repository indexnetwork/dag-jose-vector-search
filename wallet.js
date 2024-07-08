import { Wallet } from "ethers";
import { Cacao, SiweMessage } from "@didtools/cacao";
import { createDIDCacao, createDIDKey, DIDSession } from "did-session";
import { randomBytes, randomString } from "@stablelib/random";

export const getRandomDIDSession = async () => {

    const wallet = Wallet.createRandom();
    const keySeed = randomBytes(32);
    const didKey = await createDIDKey(keySeed);
    const now = new Date();
    const thirtyDaysLater = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30 ,
    );
    const siweMessage = new SiweMessage({
      domain: "index.netwok",
      address: wallet.address,
      statement: "Give this application access to some of your data on Ceramic",
      uri: didKey.id,
      version: "1",
      chainId: "1",
      nonce: randomString(10),
      issuedAt: now.toISOString(),
      expirationTime: thirtyDaysLater.toISOString(),
      resources: ["ceramic://*"],
    });

    siweMessage.signature = await wallet.signMessage(
      siweMessage.toMessage(),
    );

    const cacao = Cacao.fromSiweMessage(siweMessage);
    const did = await createDIDCacao(didKey, cacao);
    const newSession = new DIDSession({ cacao, keySeed, did });
    return newSession
};
