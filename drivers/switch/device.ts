import Homey from 'homey';
import {RCInfo} from "../../utilites/interfaces";
import httpRequest from "../../utilites/httpRequest";
import getPowerSwitchCommand from "../../utilites/getPowerSwitchCommand";
import {emitter} from '../../utilites/UDPserver';

class SwitchDevice extends Homey.Device {

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
          * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
          * we need to check whether the characteristics of this device have been changed in LOOKin APP
          */
        const DATA_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:data:${UUID}`;
        emitter.on('updated_data', async (msg: string) => {
            if(msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                let RCinfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
                await this.setStoreValue('functions', RCinfo.Functions);
            }
        });

        /**
         * RC Info gets information about current state of remote controller, being saved inside the LOOKin remote device
         * f.e. powerOn status - so we can set an actual value in after
         */
        let RCinfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
        await this.setStoreValue('status', RCinfo.Status);
        await this.setCapabilityValue('onoff', !!this.getStoreValue('status').match(/1000/));

        /**
         * exact commands may vary for different switches types (toggle, two singles or one single), so, we have to check it first
         * also, the inner APP state should not be mutated if HTTP request has been rejected - new Error is thrown in this case
         */
        this.registerCapabilityListener('onoff', async (value: boolean) => {

            let powerCommand = getPowerSwitchCommand(value, this.getStoreValue('functions'));
            if (!powerCommand) {
                this.homey.app.error('No power change command found! Please, create it in LOOKin APP first!');
                throw new Error('No power change command found! Please, create it in LOOKin APP first!');
            }

            let changeValue = await httpRequest(IP, `${path}${powerCommand}`);
            if (JSON.parse(changeValue).success === 'false') {
                this.homey.app.error('Failed to change power state! No connection to remote');
                throw new Error('Failed to change power state! No connection to remote');
            }
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

module.exports = SwitchDevice;
