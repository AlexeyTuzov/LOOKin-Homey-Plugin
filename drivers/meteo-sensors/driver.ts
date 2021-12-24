import Homey from 'homey';
import httpRequest from "../../utilites/httpRequest";
import {DeviceFullInfo} from '../../utilites/interfaces';

class MeteoSensorsDriver extends Homey.Driver {

    async onInit() {
        this.log('Meteo Sensors Driver has been initialized');
    }

    async onPairListDevices() {
        let IP = this.homey.env.LOOKinDevice.IP;
        let deviceInfo: DeviceFullInfo = JSON.parse(await httpRequest(IP, '/device'));
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
