import Homey from 'homey';
import {pairingInfo, RemoteController} from "../../utilites/interfaces";

class FanDriver extends Homey.Driver {

    async onInit() {
        this.log('Fan Driver has been initialized');
    }

    async onPairListDevices() {
        let devicesList: pairingInfo[] = [];
        try {
            let fans = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === '07');
            fans?.forEach((item: RemoteController) => devicesList.push({
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

module.exports = FanDriver;
