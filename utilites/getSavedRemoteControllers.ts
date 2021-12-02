import * as http from 'http';
import {RemoteController} from "./interfaces";
import getDetailedRCInfo from "./getDetailedRCInfo";

const getSavedRemoteControllers = async (IP: string): Promise<RemoteController[]> => {

    return new Promise((resolve, reject) => {

        http.get({host: IP, path: '/data'}, res => {
            let data: string = '';

            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', async () => {
                let result: RemoteController[] = await getDetailedRCInfo(JSON.parse(data), IP);
                if (result) {
                    resolve(result);
                } else {
                    reject(console.log('No saved remotes found in LOOK.in device! Please, add some using LOOK.in app!'));
                }
            });
            res.on('error', err => {
                reject(console.log('Error getting saved remotes from LOOK.in device!', err.stack));
            });
        });
    });

}

export default getSavedRemoteControllers;
