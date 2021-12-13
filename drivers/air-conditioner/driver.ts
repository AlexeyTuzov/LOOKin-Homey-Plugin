import Homey from 'homey';
import {pairingInfo, RemoteController} from '../../utilites/interfaces';

class AirConditionerDriver extends Homey.Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('Air Conditioner Driver has been initialized');
    }

    /**
     * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
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
