/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import { RoughRyderNFTContract, RoughRyderNFT_TransferEntity } from "generated";

RoughRyderNFTContract.Transfer.loader(({ event, context }) => {});

RoughRyderNFTContract.Transfer.handler(({ event, context }) => {
  const roughRyderNFT_TransferEntity: RoughRyderNFT_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.RoughRyderNFT_Transfer.set(roughRyderNFT_TransferEntity);
});
