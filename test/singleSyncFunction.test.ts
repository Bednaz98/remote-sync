import { singleSyncFunction } from "../src";
import { insertHash } from "../src/hashData";

const generateMockConfig = (
    mockLocalData: any,
    mockRemoteData: any,
    transformRemoteData?: (data: any) => any,
) => {
    const mockGetLocalTimeStamps = jest.fn().mockResolvedValue(
        insertHash(mockLocalData),
    );
    const mockGetRemoteTimeStamps = jest
        .fn()
        .mockResolvedValue(insertHash(mockRemoteData));
    const mockGetRemoteData = jest.fn().mockResolvedValue(
        insertHash(mockRemoteData),
    );
    const mockGetLocalData = jest.fn().mockResolvedValue(
        insertHash(mockLocalData),
    );
    const mockSyncRemote = jest.fn().mockResolvedValue(void 0);
    const mockSyncLocal = jest.fn().mockResolvedValue(void 0);
    return {
        getLocalTimeStamps: mockGetLocalTimeStamps,
        getRemoteTimeStamps: mockGetRemoteTimeStamps,
        getRemoteData: mockGetRemoteData,
        getLocalData: mockGetLocalData,
        syncRemote: mockSyncRemote,
        syncLocal: mockSyncLocal,
        transformRemoteData,
    };
};

describe("singleSyncFunction", () => {
    test("dataSynced", async () => {
        const mockLocalData = insertHash({
            id: "1",
        });
        const mockRemoteData = insertHash({
            id: "1",
        });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockLocalData);
    });
    test("data not initialized", async () => {
        const mockLocalData = insertHash({ id: "1" });
        const mockRemoteData = insertHash({ id: "1" });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockRemoteData);
    });
    test("localRequiredSync - indeterminate", async () => {
        const mockLocalData = insertHash({ id: "1" });
        const mockRemoteData = insertHash({ id: "1" });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockRemoteData);
    });
    test("localRequiredSync - by timestamps", async () => {
        const mockLocalData = insertHash({ id: "1", modifiedAt: new Date(0) });
        const mockRemoteData = insertHash({ id: "1", modifiedAt: new Date(1) });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockRemoteData);
    });
    test("remoteRequiredSync - by remote missing", async () => {
        const mockLocalData = insertHash({ id: "1", dataHash: "1" });
        const mockRemoteData = insertHash({ id: "1" });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockLocalData);
    });
    test("remoteRequiredSync - by timestamps", async () => {
        const mockLocalData = insertHash({ id: "1", modifiedAt: new Date(1) });
        const mockRemoteData = insertHash({
            id: "1",
            modifiedAt: new Date(0),
        });
        const config = generateMockConfig(mockLocalData, mockRemoteData);
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(mockLocalData);
    });
    test("transformRemoteData", async () => {
        const mockLocalData = insertHash({ id: "1", extraLocal: "l" });
        const mockRemoteData = insertHash({ id: "1", extraRemote: "r" });
        const transformFunction = (data: typeof mockLocalData) =>
            insertHash({
                ...data,
                extraTransformed: "t",
            });
        const config = generateMockConfig(
            mockLocalData,
            mockRemoteData,
            transformFunction,
        );
        const result = await singleSyncFunction<
            typeof mockLocalData,
            typeof mockRemoteData
        >(config);
        expect(result).toEqual(insertHash({
            ...mockRemoteData,
            extraTransformed: "t",
        }));
    });
});
