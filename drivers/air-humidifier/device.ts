import Homey from 'homey';
import {Functions, RCInfo} from "../../utilites/interfaces";
import httpRequest from "../../utilites/httpRequest";
import getPowerSwitchCommand from "../../utilites/getPowerSwitchCommand";
import {emitter} from '../../utilites/UDPserver';
import getNumberOfModes from "../../utilites/getNumberOfModes";

class HumidifierDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {

        let UUID: string = this.getStoreValue('UUID');
        let IP: string = this.homey.env.LOOKinDevice.IP;
        let path: string = `/commands/ir/localremote/${UUID}`;
        let name: string = this.getName();
        let ID: string = this.homey.env.LOOKinDevice.ID;

        /**
         * The following function gets information about current state of remote controller, being saved inside the LOOKin remote device
         * f.e. powerOn status - and set an actual value in store of the driver. It is called on init of device and in case of it's update.
         */
        const actualiseStatus = async (): Promise<any> => {
            let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
            if (RCInfo.success === 'false') {
                this.error('Failed to update status of device! No connection to remote');
                throw new Error('Failed to update status of device! No connection to remote');
            }
            await this.setStoreValue('status', RCInfo.Status).catch(this.error);
            await this.setCapabilityValue('onoff', !!this.getStoreValue('status')[0].match(/1/)).catch(this.error);
        }

        await actualiseStatus();

        /**
         * We need to set an appropriate type of "mode" capability - it depends of it's type "single" or "toggle"
         * Simple button is suitable for "single" type, but we need a picker UI component for "toggle" type
         */

        if (this.getStoreValue('functions').find((item: Functions) => item.Name === 'mode')) {
            let numberOfModes: number = await getNumberOfModes(UUID, IP, this.getStoreValue('functions'));
            switch (numberOfModes) {
                case 1: {
                    await this.addCapability('mode_btn');
                    this.registerCapabilityListener('mode_btn', async () => {
                        await sendRequest('04FF', 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 2: {
                    await this.addCapability('mode_2_picker');
                    this.registerCapabilityListener('mode_2_picker', async (value) => {
                        await sendRequest(`040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 3: {
                    await this.addCapability('mode_3_picker');
                    this.registerCapabilityListener('mode_3_picker', async (value) => {
                        await sendRequest(`040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 4: {
                    await this.addCapability('mode_4_picker');
                    this.registerCapabilityListener('mode_4_picker', async (value) => {
                        await sendRequest(`040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                default:
                    break;
            }
        }

        /**
         * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
         * we need to check whether the characteristics or status of this device have been changed in LOOKin APP
         */
        const DATA_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:data:${UUID}`;
        emitter.on('updated_data', async (msg: string) => {
            if (msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
                if (RCInfo.success === 'false') {
                    this.error('Failed to update functions of device! No connection to remote');
                    throw new Error('Failed to update functions of device! No connection to remote');
                }
                await this.setStoreValue('functions', RCInfo.Functions).catch(this.error);
            }
        });

        const STATUS_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:87:FE:${UUID}`;
        emitter.on('updated_status', async (msg: string) => {
            if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
                await actualiseStatus();
            }
        });

        /**
         * Next step, we need to describe the function, that is called each time, capability is being changed.
         * It checks for the corresponding function of remote controller in LOOKin APP and trying to send a request.
         * If no such function added in LOOKin APP or request has been rejected - the New error is thrown
         */
        const sendRequest = async (command: string, alias: string, commName: string, IP: string, path: string): Promise<any> => {
            if (alias && !(this.getStoreValue('functions').find((item: Functions) => item.Name === alias)) || !command) {
                this.error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
                throw new Error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
            }
            let reqCheck = await httpRequest(IP, `${path}${command}`);
            if (JSON.parse(reqCheck).success === 'false') {
                this.error(`Failed to change the ${commName}! No connection to remote`);
                throw new Error(`Failed to change the ${commName}! No connection to remote`);
            }
        }

        /**
         * exact commands may vary for different switches types (toggle, two singles or one single), so, we have to check it first
         * also, the inner APP state should not be mutated if HTTP request has been rejected - new Error is thrown in this case
         */
        this.registerCapabilityListener('onoff', async (value: boolean) => {
            let powerCommand = getPowerSwitchCommand(value, this.getStoreValue('functions'));
            await sendRequest(powerCommand, '', 'power', IP, path);
        });

        this.log(`${name} has been initialized`);
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        let name = this.getName();
        this.log(`${name} has been added`);
    }

    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({oldSettings: {}, newSettings: {}, changedKeys: {}}): Promise<string | void> {
        let name = this.getName();
        this.log(`${name} settings were changed`);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name: string) {
        this.log(`Device was renamed to ${name}`);
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        let name = this.getName();
        this.log(`${name} has been deleted`);
    }

}

module.exports = HumidifierDevice;
