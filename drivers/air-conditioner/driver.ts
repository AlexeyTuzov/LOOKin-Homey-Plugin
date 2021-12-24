import Homey from 'homey';
import {pairingInfo, RemoteController} from '../../utilites/interfaces';

class AirConditionerDriver extends Homey.Driver {

    async onInit() {
        this.log('Air Conditioner Driver has been initialized');
    }

    async onPairListDevices() {
        let devicesList: pairingInfo[] = [];
        try {
            let airConditioners = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === 'EF');
            airConditioners?.forEach((item: RemoteController) => devicesList.push({
                name: `${item.deviceInfo.Name}`,
                data: {
                    id: `${item.deviceInfo.Name}${item.UUID}`
                },
                store: {
                    UUID: item.UUID,
                    status: item.deviceInfo.Status,
                    codeset: item.deviceInfo.Extra
                }
            }));
            return devicesList;
        } catch {
            return [];
        }
    }

}

module.exports = AirConditionerDriver;
