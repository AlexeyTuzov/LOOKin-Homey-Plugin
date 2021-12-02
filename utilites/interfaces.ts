export interface Device {
    ID: string;
    type: string;
    onBatteries: string;
    IP: string;
    autoVersion: string;
    storageVersion: string;
    savedRC?: RemoteController[] | undefined;
}

export interface RemoteController {
    Type: string;
    UUID: string;
    Updated: number;
    IP: string;
    deviceInfo: RCInfo;
}

export interface RCInfo {
    Type: string,
    Name: string,
    Updated: string,
    Status: string,
    Functions?: Functions [] | undefined;
}

export interface Functions {
    Name: string,
    Type: string
}

export interface pairingInfo {
    name: string;
    data: {
        id: string
    },
    store: {
        UUID: string,
        functions: Functions[] | undefined,
        IP: string,
        status: string
    };
}
