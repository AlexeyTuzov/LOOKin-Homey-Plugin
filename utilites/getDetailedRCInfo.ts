import {RCInfo, RemoteController} from "./interfaces";
import * as http from 'http';

interface RCitem {
    Type: string,
    UUID: string,
    Updated: number
}

const getDetailedRCInfo = async (data: RCitem[], IP: string): Promise<RemoteController[]> => {
    let result: RemoteController[] = [];

    for await (let item of data) {
        let info = await getInfo(IP, item.UUID);
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

const getInfo = async (IP: string, UUID: string): Promise<RCInfo> => {

    return new Promise( (resolve, reject) => {

        http.get({host: IP, path:`/data/${UUID}`}, res => {
            let data: string = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

            res.on('error', err => {
                reject(console.log('Error getting info from one of saved remotes', err.stack));
            });
        });
    });
}

export default getDetailedRCInfo;
