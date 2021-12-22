import {Device} from "homey";
import {Functions} from "../interfaces";
import sendRequest from "./sendRequest";

const checkAndRegisterFanParameters = async (device: Device,
                                             characteristic: string,
                                             IP: string,
                                             path: string): Promise<void> => {
    if (device.getStoreValue('functions').find((item: Functions) => item.Name === characteristic && item.Type === 'single')) {
        switch (characteristic) {
            case 'swing': {
                await device.addCapability('swing_btn');
                device.registerCapabilityListener('swing_btn', async () => {
                    await sendRequest(device, '0AFF', 'swing', 'Swing', IP, path);
                });
                break;
            }
            case 'speed': {
                await device.addCapability('speed_btn');
                device.registerCapabilityListener('speed_btn', async () => {
                    await sendRequest(device, '0BFF', 'speed', 'Speed', IP, path);
                });
                break;
            }
            default:
                break;
        }
    }
    if (device.getStoreValue('functions').find((item: Functions) => item.Name === characteristic && item.Type === 'toggle')) {
        switch (characteristic) {
            case 'swing': {
                await device.addCapability('swing_mode1_btn');
                await device.addCapability('swing_mode2_btn');
                device.registerCapabilityListener('swing_mode1_btn', async () => {
                    await sendRequest(device, '0A00', 'swing', 'Swing Mode 1', IP, path);
                });
                device.registerCapabilityListener('swing_mode2_btn', async () => {
                    await sendRequest(device, '0A01', 'swing', 'Swing Mode 2', IP, path);
                });
                break;
            }
            case 'speed': {
                await device.addCapability('speed_up_btn');
                await device.addCapability('speed_down_btn');
                device.registerCapabilityListener('speed_up_btn', async () => {
                    await sendRequest(device, '0B00', 'speed', 'Speed Up', IP, path);
                });
                device.registerCapabilityListener('speed_down_btn', async () => {
                    await sendRequest(device, '0B01', 'speed', 'Speed Down', IP, path);
                });
                break;
            }
            default:
                break;
        }
    }

}

export default checkAndRegisterFanParameters;
