export interface SyncObject {
    id: string;
    dataHash?: string;
    modifiedAt?: number | Date;
}

export enum SyncStatus {
    remoteRequiredSync,
    localRequiredSync,
    dataSynced,
    noneInitialized,
}
