import objectHash from "object-hash";
import { insertHash } from "../src/hashData";

describe("hashData", () => {
    test("expect hash to be the same", () => {
        const data = { id: "1", modifiedAt: new Date(0) };
        const hashedData = insertHash(data);
        expect(hashedData.dataHash).toBe(objectHash(data));
        expect(hashedData.id).toBe(data.id);
        expect(hashedData.modifiedAt).toBe(data.modifiedAt);
    });
    test("try recursing hashing", () => {
        const data = { id: "1", modifiedAt: new Date(0), extra: "extra" };
        const hashedData1 = insertHash(data);
        const hashedData2 = insertHash(hashedData1);
        const hashedData3 = insertHash(hashedData2);
        expect(hashedData1).toEqual(hashedData2);
        expect(hashedData2).toEqual(hashedData3);
        expect(hashedData3).toEqual(hashedData1);
    });
});
