import Homey from 'homey';
import getPowerSwitchCommand from "../../utilites/getPowerSwitchCommand";
import {emitter} from '../../utilites/UDPserver';
import sendRequest from "../../utilites/homey_device_hooks/sendRequest";
import actualiseStatus from "../../utilites/homey_device_hooks/actualiseStatus";
import actualiseFunctions from "../../utilites/homey_device_hooks/actualiseFunctions";

class SwitchDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {

        let UUID: string = this.getStoreValue('UUID');
        let IP: string = this.homey.env.LOOKinDevice.IP;
        let path: string = `/commands/ir/localremote/${UUID}`;
        let name: string = this.getName();
        let ID: string = this.homey.env.LOOKinDevice.ID;

        await actualiseStatus(this, IP, UUID);

        /**
         * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
         * we need to check whether the characteristics or status of this device have been changed in LOOKin APP
         */
        const DATA_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:data:${UUID}`;
        emitter.on('updated_data', async (msg: string) => {
            if (msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                await actualiseFunctions(this, IP, UUID);
            }
        });

        const STATUS_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:87:FE:${UUID}`;
        emitter.on('updated_status', async (msg: string) => {
            if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
                await actualiseStatus(this, IP, UUID);
            }
        });

        /**
         * exact commands may vary for different switches types (toggle, two singles or one single), so, we have to check it first
         * also, the inner APP state should not be mutated if HTTP request has been rejected - new Error is thrown in this case
         */
        this.registerCapabilityListener('onoff', async (value: boolean) => {
            let powerCommand = getPowerSwitchCommand(value, this.getStoreValue('functions'));
            await sendRequest(this, powerCommand, '', 'power', IP, path);
        });

        this.log(`${name} has been initialized`);
    }

    async onAdded() {
        let name = this.getName();
        this.log(`${name} has been added`);
    }

    async onSettings({oldSettings: {}, newSettings: {}, changedKeys: {}}): Promise<string | void> {
        let name = this.getName();
        this.log(`${name} settings were changed`);
    }

    async onRenamed(name: string) {
        this.log(`Device was renamed to ${name}`);
    }

    async onDeleted() {
        let name = this.getName();
        this.log(`${name} has been deleted`);
    }

}

module.exports = SwitchDevice;
