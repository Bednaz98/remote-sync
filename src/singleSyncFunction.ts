import { checkSyncStatus } from "./checkFunction";
import { insertHash } from "./hashData";
import { SyncObject, SyncStatus } from "./types";

export interface SingleSyncConfig<
    LocalObject extends SyncObject,
    RemoteObject extends SyncObject,
> {
    getRemoteTimeStamps: () => Promise<SyncObject>;
    getLocalTimeStamps: () => Promise<SyncObject>;
    getRemoteData: () => Promise<RemoteObject>;
    getLocalData: () => Promise<LocalObject>;
    syncRemote: (data: LocalObject) => Promise<void>;
    syncLocal: (data: RemoteObject) => Promise<void>;
    transformRemoteData?: (data: RemoteObject) => LocalObject;
}

export async function singleSyncFunction<
    LocalObject extends SyncObject,
    RemoteObject extends SyncObject,
>(
    config: SingleSyncConfig<LocalObject, RemoteObject>,
): Promise<LocalObject | null> {
    const localTimeStamps = await config.getLocalTimeStamps();
    const remoteTimeStamps = await config.getRemoteTimeStamps();
    const syncStatus = checkSyncStatus(localTimeStamps, remoteTimeStamps);

    switch (syncStatus) {
        case SyncStatus.dataSynced:
            return await config.getLocalData();
        case SyncStatus.localRequiredSync: {
            const remoteData = await config.getRemoteData();
            const dataWithHash = insertHash(remoteData);
            await config.syncLocal(dataWithHash);
            return config.transformRemoteData
                ? config.transformRemoteData(dataWithHash)
                : remoteData as unknown as LocalObject;
        }
        case SyncStatus.remoteRequiredSync: {
            const localData = await config.getLocalData();
            const dataWithHash = insertHash(localData);
            await config.syncRemote(dataWithHash);
            return dataWithHash;
        }
        default: {
            const remoteData = await config.getRemoteData();
            const dataWithHash = insertHash(remoteData);

            await config.syncLocal(dataWithHash);
            return config.transformRemoteData
                ? config.transformRemoteData(dataWithHash)
                : remoteData as unknown as LocalObject;
        }
    }
}
