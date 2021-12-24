import {RemoteController} from "./interfaces";
import httpRequest from "./httpRequest";

interface RCitem {
    Type: string,
    UUID: string,
    Updated: number
}

const getDetailedRCInfo = async (data: RCitem[], IP: string): Promise<RemoteController[]> => {
    let result: RemoteController[] = [];

    for await (let item of data) {
        let info = JSON.parse(await httpRequest(IP, `/data/${item.UUID}`));
        result.push({
            Type: item.Type,
            UUID: item.UUID,
            Updated: item.Updated,
            IP: IP,
            deviceInfo: info
        });
    }
    return result;
}

export default getDetailedRCInfo;
