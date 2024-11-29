import { checkSyncStatus } from "./checkFunction";
import { SyncObject, SyncStatus } from "./types";

export interface MultiSyncConfig<
    LocalObject extends SyncObject,
    RemoteObject extends SyncObject,
> {
    getRemoteTimeStamps: () => Promise<SyncObject[]>;
    getLocalTimeStamps: () => Promise<SyncObject[]>;
    getRemoteData: (ids: SyncObject["id"][]) => Promise<RemoteObject[]>;
    getLocalData: (ids: SyncObject["id"][]) => Promise<LocalObject[]>;
    syncRemote: (data: LocalObject[]) => Promise<void>;
    syncLocal: (data: RemoteObject[]) => Promise<void>;
    transformRemoteData?: (data: RemoteObject[]) => LocalObject[];
}

function scanSyncStatus(
    localTimeStamps: SyncObject[],
    remoteTimeStamps: SyncObject[],
) {
    const localOnly = localTimeStamps.filter((local) =>
        !remoteTimeStamps.some((remote) => remote.id === local.id)
    );
    const remoteOnly = remoteTimeStamps.filter((remote) =>
        !localTimeStamps.some((local) => local.id === remote.id)
    );
    const idExistBoth = localTimeStamps.filter((local) =>
        remoteTimeStamps.some((remote) => remote.id === local.id)
    );

    const bothSync = idExistBoth.map((local) => {
        const remote = remoteTimeStamps.find((remote) =>
            remote.id === local.id
        );
        return {
            id: local.id,
            status: checkSyncStatus(local, remote),
        };
    });

    return {
        localOnly,
        remoteOnly,
        bothSync,
    };
}

export async function multiSyncFunction<
    LocalObject extends SyncObject,
    RemoteObject extends SyncObject,
>(config: MultiSyncConfig<LocalObject, RemoteObject>) {
    const localTimeStamps = await config.getLocalTimeStamps();
    const remoteTimeStamps = await config.getRemoteTimeStamps();
    const syncStatus = scanSyncStatus(localTimeStamps, remoteTimeStamps);
    const syncForLocalOnly = syncStatus?.bothSync?.filter(
        (local) => local.status === SyncStatus.localRequiredSync,
    ) ?? [];
    const syncForRemoteOnly = syncStatus?.bothSync?.filter(
        (remote) => remote.status === SyncStatus.remoteRequiredSync,
    ) ?? [];
    const existOnlyLocal = syncStatus?.localOnly ?? [];
    const existOnlyRemote = syncStatus?.remoteOnly ?? [];

    if (syncForLocalOnly.length > 0 || existOnlyLocal.length > 0) {
        const localData = await config.getLocalData(
            [
                ...syncForLocalOnly.map((local) => local.id),
                ...existOnlyLocal.map((local) => local.id),
            ],
        );
        await config.syncRemote(localData);
    }
    if (syncForRemoteOnly.length > 0 || existOnlyRemote.length > 0) {
        const remoteData = await config.getRemoteData(
            [
                ...syncForRemoteOnly.map((remote) => remote.id),
                ...existOnlyRemote.map((remote) => remote.id),
            ],
        );
        await config.syncLocal(remoteData);
    }
}
