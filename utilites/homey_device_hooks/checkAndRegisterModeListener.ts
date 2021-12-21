import {Device} from "homey";
import {Functions} from "../interfaces";
import getNumberOfModes from "../getNumberOfModes";
import sendRequest from "./sendRequest";

/**
 * We need to set an appropriate type of "mode" capability - it depends of it's type "single" or "toggle"
 * Simple button is suitable for "single" type, but we need a picker UI component for "toggle" type
 */

const checkAndRegisterModeListener = async (device: Device, IP: string, UUID: string, path: string): Promise<void> => {
    if (device.getStoreValue('functions').find((item: Functions) => item.Name === 'mode')) {
        let numberOfModes: number = await getNumberOfModes(UUID, IP, device.getStoreValue('functions'));
        switch (numberOfModes) {
            case 1: {
                await device.addCapability('mode_btn');
                device.registerCapabilityListener('mode_btn', async () => {
                    await sendRequest(device,'04FF', 'mode', 'Humidifier mode', IP, path);
                });
                break;
            }
            case 2: {
                await device.addCapability('mode_2_picker');
                device.registerCapabilityListener('mode_2_picker', async (value) => {
                    await sendRequest(device,`040${value}`, 'mode', 'Humidifier mode', IP, path);
                });
                break;
            }
            case 3: {
                await device.addCapability('mode_3_picker');
                device.registerCapabilityListener('mode_3_picker', async (value) => {
                    await sendRequest(device,`040${value}`, 'mode', 'Humidifier mode', IP, path);
                });
                break;
            }
            case 4: {
                await device.addCapability('mode_4_picker');
                device.registerCapabilityListener('mode_4_picker', async (value) => {
                    await sendRequest(device,`040${value}`, 'mode', 'Humidifier mode', IP, path);
                });
                break;
            }
            default:
                break;
        }
    }
}

export default checkAndRegisterModeListener;
