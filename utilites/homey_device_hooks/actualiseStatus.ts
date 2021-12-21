import httpRequest from "../httpRequest";
import {Device} from "homey";
import {RCInfo} from '../interfaces';

/**
 * The following function gets information about current state of remote controller, being saved inside the LOOKin remote device
 * f.e. powerOn status - and set an actual value in store of the driver. It is called on init of device and in case of it's update.
 */

const actualiseStatus = async (device: Device, IP: string, UUID: string): Promise<any> => {
    let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
    if (RCInfo.success === 'false') {
        device.error('Failed to update status of device! No connection to remote');
        throw new Error('Failed to update status of device! No connection to remote');
    }
    await device.setStoreValue('status', RCInfo.Status).catch(device.error);
    await device.setCapabilityValue('onoff', !!device.getStoreValue('status')[0].match(/1/)).catch(device.error);
    if (device.hasCapability('volume_mute')) {
        await device.setCapabilityValue('volume_mute', !!device.getStoreValue('status').match(/\w{2}0\w/)).catch(device.error);
    }
}

export default actualiseStatus;
