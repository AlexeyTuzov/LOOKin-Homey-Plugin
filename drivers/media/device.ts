import Homey from 'homey';
import getPowerSwitchCommand from '../../utilites/getPowerSwitchCommand';
import httpRequest from '../../utilites/httpRequest';
import {Functions, RCInfo} from '../../utilites/interfaces';
import {emitter} from '../../utilites/UDPserver';

class MediaDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {

        let UUID: string = this.getStoreValue('UUID');
        let IP: string = this.getStoreValue('IP');
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
                this.homey.app.error('Failed to update status of device! No connection to remote');
                throw new Error('Failed to update status of device! No connection to remote');
            }
            await this.setStoreValue('status', RCInfo.Status);
            await this.setCapabilityValue('onoff', !!this.getStoreValue('status').match(/10\w{1,2}/));
            await this.setCapabilityValue('volume_mute', !!this.getStoreValue('status').match(/\w{2}0\w/));
        }

        await actualiseStatus();

        /**
         * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
         * we need to check whether the characteristics or status of this device have been changed in LOOKin APP
         */
        const DATA_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:data:${UUID}`;
        emitter.on('updated_data', async (msg: string) => {
            if (msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
                if (RCInfo.success === 'false') {
                    this.homey.app.error('Failed to update functions of device! No connection to remote');
                    throw new Error('Failed to update functions of device! No connection to remote');
                }
                await this.setStoreValue('functions', RCInfo.Functions);
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
                this.homey.app.error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
                throw new Error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
            }
            let reqCheck = await httpRequest(IP, `${path}${command}`);
            if (JSON.parse(reqCheck).success === 'false') {
                this.homey.app.error(`Failed to change the ${commName}! No connection to remote`);
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

        this.registerCapabilityListener('volume_up', async () => {
            await sendRequest('06FF', 'volup', 'volume up', IP, path);
        });

        this.registerCapabilityListener('volume_down', async () => {
            await sendRequest('07FF', 'voldown', 'volume down', IP, path);
        });

        this.registerCapabilityListener('volume_mute', async () => {
            await sendRequest('05FF', 'mute', 'volume mute', IP, path);
        });

        this.registerCapabilityListener('button', async () => {
            await sendRequest('04FF', 'mode', 'source mode', IP, path);
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

module.exports = MediaDevice;
