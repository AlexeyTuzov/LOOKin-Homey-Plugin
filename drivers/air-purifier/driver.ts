import Homey from 'homey';
import {pairingInfo, RemoteController} from "../../utilites/interfaces";

class PurifierDriver extends Homey.Driver {

    async onInit() {
        this.log('Air Purifier Driver has been initialized');
    }

    async onPairListDevices() {
        let devicesList: pairingInfo[] = [];
        try {
            let airPurifiers = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === '05');
            airPurifiers?.forEach((item: RemoteController) => devicesList.push({
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

module.exports = PurifierDriver;
