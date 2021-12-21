import {Device} from "homey";
import httpRequest from "../httpRequest";
import {RCInfo} from "../interfaces";

/**
 * The following function gets information about current functions of remote controller in case of them changed inside the LOOKin remote device
 * f.e. powerOn/Off type (single/toggle) - and set an actual value in store of the driver. It is called when "updated!" signal has been received.
 */

const actualiseFunctions = async (device: Device, IP: string, UUID: string): Promise<any> => {
    let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
    if (RCInfo.success === 'false') {
        device.error('Failed to update functions of device! No connection to remote');
        throw new Error('Failed to update functions of device! No connection to remote');
    }
    await device.setStoreValue('functions', RCInfo.Functions).catch(device.error);
}

export default actualiseFunctions;
