import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  RoughRyderNFT_TransferEntity
} from "generated";
const { MockDb, RoughRyderNFT, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  roughRyderNFT_TransferCount: BigInt(0),
};

describe("RoughRyderNFT contract Transfer event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock RoughRyderNFT contract Transfer event
  const mockRoughRyderNFTTransferEvent = RoughRyderNFT.Transfer.createMockEvent({
    from: Addresses.defaultAddress,
    to: Addresses.defaultAddress,
    tokenId: 0n,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = RoughRyderNFT.Transfer.processEvent({
    event: mockRoughRyderNFTTransferEvent,
    mockDb: mockDbFinal,
  });

  it("RoughRyderNFT_TransferEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualRoughRyderNFTTransferEntity = mockDbUpdated.entities.RoughRyderNFT_Transfer.get(
      mockRoughRyderNFTTransferEvent.transactionHash +
        mockRoughRyderNFTTransferEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedRoughRyderNFTTransferEntity: RoughRyderNFT_TransferEntity = {
      id:
        mockRoughRyderNFTTransferEvent.transactionHash +
        mockRoughRyderNFTTransferEvent.logIndex.toString(),
      from: mockRoughRyderNFTTransferEvent.params.from,
      to: mockRoughRyderNFTTransferEvent.params.to,
      tokenId: mockRoughRyderNFTTransferEvent.params.tokenId,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualRoughRyderNFTTransferEntity, expectedRoughRyderNFTTransferEntity, "Actual RoughRyderNFTTransferEntity should be the same as the expectedRoughRyderNFTTransferEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      roughRyderNFT_TransferCount: MOCK_EVENTS_SUMMARY_ENTITY.roughRyderNFT_TransferCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual RoughRyderNFTTransferEntity should be the same as the expectedRoughRyderNFTTransferEntity");
  });
});
