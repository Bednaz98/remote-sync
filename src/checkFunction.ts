import { SyncObject, SyncStatus } from "./types";

export function checkTimeStamps(
    localObject: SyncObject,
    remoteObject: SyncObject,
) {
    if (
        typeof localObject.modifiedAt === "number" &&
        typeof remoteObject.modifiedAt === "number"
    ) {
        return localObject.modifiedAt > remoteObject.modifiedAt
            ? SyncStatus.remoteRequiredSync
            : SyncStatus.localRequiredSync;
    } else if (
        typeof localObject.modifiedAt === "object" &&
        typeof remoteObject.modifiedAt === "object"
    ) {
        return localObject.modifiedAt.getTime() >
                remoteObject.modifiedAt.getTime()
            ? SyncStatus.remoteRequiredSync
            : SyncStatus.localRequiredSync;
    } else if (
        typeof localObject.modifiedAt === "object" &&
        typeof remoteObject.modifiedAt === "number"
    ) {
        return localObject.modifiedAt.getTime() > remoteObject.modifiedAt
            ? SyncStatus.remoteRequiredSync
            : SyncStatus.localRequiredSync;
    } else if (
        typeof localObject.modifiedAt === "number" &&
        typeof remoteObject.modifiedAt === "object"
    ) {
        return localObject.modifiedAt > remoteObject.modifiedAt.getTime()
            ? SyncStatus.remoteRequiredSync
            : SyncStatus.localRequiredSync;
    }
    return SyncStatus.noneInitialized;
}

export function checkSyncStatus(
    localObject?: SyncObject | null,
    remoteObject?: SyncObject | null,
) {
    if (!localObject && !remoteObject) return SyncStatus.noneInitialized;
    else if (!localObject?.dataHash && !remoteObject?.dataHash) {
        return SyncStatus.noneInitialized;
    } else if (localObject && !remoteObject) {
        return SyncStatus.remoteRequiredSync;
    } else if (!localObject && remoteObject) {
        return SyncStatus.remoteRequiredSync;
    } else if (!localObject?.dataHash && remoteObject?.dataHash) {
        return SyncStatus.localRequiredSync;
    } else if (localObject?.dataHash && !remoteObject?.dataHash) {
        return SyncStatus.remoteRequiredSync;
    } else if (localObject?.dataHash === remoteObject?.dataHash) {
        return SyncStatus.dataSynced;
    } else if (
        localObject && remoteObject &&
        localObject.modifiedAt && remoteObject.modifiedAt
    ) {
        return checkTimeStamps(localObject, remoteObject);
    }
    return SyncStatus.noneInitialized;
}
