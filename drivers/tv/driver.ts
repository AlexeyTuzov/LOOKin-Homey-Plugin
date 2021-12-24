import Homey from 'homey';
import {pairingInfo, RemoteController} from "../../utilites/interfaces";

class TVDriver extends Homey.Driver {

    async onInit() {
        this.log(' TV Driver has been initialized');
    }

    async onPairListDevices() {
        let devicesList: pairingInfo[] = [];
        try {
            let TVs = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === '01');
            TVs?.forEach((item: RemoteController) => devicesList.push({
                name: `${item.deviceInfo.Name}`,
                data: {
                    id: `${item.deviceInfo.Name}${item.UUID}`
                },
                store: {
                    UUID: `${item.UUID}`,
                    functions: item.deviceInfo.Functions,
                    status: item.deviceInfo.Status
                }
            }));
            return devicesList;
        } catch {
            return [];
        }
    }

}

module.exports = TVDriver;
