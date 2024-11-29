import objectHash from "object-hash";

function hashData(data: any): string {
    const tempData = { ...data };
    delete tempData.dataHash;
    return objectHash(tempData);
}

export function insertHash(data: any): any {
    const hashString = hashData(data);
    const withHash = {
        ...data,
        dataHash: hashString,
    };
    return withHash;
}
