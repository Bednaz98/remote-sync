import { checkTimeStamps, SyncStatus } from "../src";

describe("checkTimeStamps", () => {
    test("local is newer", () => {
        // number number
        expect(
            checkTimeStamps({ id: "1", modifiedAt: 1 }, {
                id: "1",
                modifiedAt: 0,
            }),
        ).toBe(SyncStatus.remoteRequiredSync);
        // date date
        expect(
            checkTimeStamps({ id: "1", modifiedAt: new Date(1) }, {
                id: "1",
                modifiedAt: new Date(0),
            }),
        ).toBe(SyncStatus.remoteRequiredSync);
        // number date
        expect(
            checkTimeStamps({ id: "1", modifiedAt: 1 }, {
                id: "1",
                modifiedAt: new Date(0),
            }),
        ).toBe(SyncStatus.remoteRequiredSync);
        // date number
        expect(
            checkTimeStamps({ id: "1", modifiedAt: new Date(1) }, {
                id: "1",
                modifiedAt: 0,
            }),
        ).toBe(SyncStatus.remoteRequiredSync);
    });
    test("remote is newer", () => {
        // number number
        expect(
            checkTimeStamps({ id: "1", modifiedAt: 0 }, {
                id: "1",
                modifiedAt: 1,
            }),
        ).toBe(SyncStatus.localRequiredSync);
        // date date
        expect(
            checkTimeStamps({ id: "1", modifiedAt: new Date(0) }, {
                id: "1",
                modifiedAt: new Date(1),
            }),
        ).toBe(SyncStatus.localRequiredSync);
        // number date
        expect(
            checkTimeStamps({ id: "1", modifiedAt: new Date(0) }, {
                id: "1",
                modifiedAt: 1,
            }),
        ).toBe(SyncStatus.localRequiredSync);
        // date number
        expect(
            checkTimeStamps({ id: "1", modifiedAt: new Date(0) }, {
                id: "1",
                modifiedAt: new Date(1),
            }),
        ).toBe(SyncStatus.localRequiredSync);
    });
});
