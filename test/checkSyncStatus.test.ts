import { checkSyncStatus, SyncStatus } from "../src";

describe("checkSyncStatus", () => {
    test("noneInitialized", () => {
        expect(checkSyncStatus(undefined, undefined)).toBe(
            SyncStatus.noneInitialized,
        );
        expect(checkSyncStatus(null, null)).toBe(
            SyncStatus.noneInitialized,
        );
        expect(checkSyncStatus(null, { id: "1" })).toBe(
            SyncStatus.noneInitialized,
        );
    });
    test("synced by hash", () => {
        expect(
            checkSyncStatus({ id: "1", dataHash: "1" }, {
                id: "1",
                dataHash: "1",
            }),
        ).toBe(SyncStatus.dataSynced);
    });
    test("localRequiredSync", () => {
        expect(
            checkSyncStatus({ id: "1" }, { id: "1", dataHash: "1" }),
        ).toBe(SyncStatus.localRequiredSync);
    });
    test("remoteRequiredSync", () => {
        expect(
            checkSyncStatus({ id: "1", dataHash: "1" }, { id: "1" }),
        ).toBe(SyncStatus.remoteRequiredSync);
    });
});
