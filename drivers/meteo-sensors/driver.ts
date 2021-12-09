import Homey from 'homey';
import httpRequest from "../../utilites/httpRequest";
import {device} from '../../utilites/interfaces';

class MeteoSensorsDriver extends Homey.Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('Meteo Sensors Driver has been initialized');
    }

    /**
     * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        let IP = this.homey.env.LOOKinDevice.IP;
        let deviceInfo: device = JSON.parse(await httpRequest(IP, '/device'));
        let version = parseInt(deviceInfo.MRDC.slice(0, 2));
        if (version < 2) {
            this.error(`This version ${version} of LOOKin remote do not support meteo sensors!`);
            throw new Error(`This version ${version} of LOOKin remote do not support meteo sensors!`);
        }
        return [
            {
                name: 'Meteo Sensors',
                data: {
                    id: deviceInfo.ID
                }
            }
        ]
    }

}

module.exports = MeteoSensorsDriver;
