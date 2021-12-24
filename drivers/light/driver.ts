import Homey from 'homey';
import {pairingInfo, RemoteController} from "../../utilites/interfaces";

class LightBulbDriver extends Homey.Driver {

    async onInit() {
        this.log('Light Bulb Driver has been initialised!');
    }

    async onPairListDevices() {
        let devicesList: pairingInfo[] = [];
        try {
            let lights = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === '03');
            lights?.forEach((item: RemoteController) => devicesList.push({
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

module.exports = LightBulbDriver;
