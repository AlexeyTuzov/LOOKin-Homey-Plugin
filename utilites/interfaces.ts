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
    Type: string;
    Name: string;
    Updated: string;
    Status: string;
    Functions?: Functions [] | undefined;
    success?: string;
    Extra?: string;
}

export interface Functions {
    Name: string;
    Type: string;
}

export interface pairingInfo {
    name: string;
    data: {
        id: string;
    },
    store: {
        UUID: string;
        functions?: Functions[] | undefined;
        status: string;
        codeset?: string;
    };
}

export interface DeviceFullInfo {
    Type: string,
    MRDC: string,
    Status: string,
    ID: string,
    Name: string,
    Time: string,
    Timezone: string,
    PowerMode: string,
    CurrentVoltage: string,
    Firmware: string,
    Temperature: string,
    HomeKit: string,
    EcoMode: string,
    SensorMode: string
}
