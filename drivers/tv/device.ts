import Homey from 'homey';
import {emitter} from "../../utilites/UDPserver";
import getPowerSwitchCommand from "../../utilites/getPowerSwitchCommand";
import actualiseStatus from "../../utilites/homey_device_hooks/actualiseStatus";
import actualiseFunctions from "../../utilites/homey_device_hooks/actualiseFunctions";
import sendRequest from "../../utilites/homey_device_hooks/sendRequest";
import checkAndRegisterModeListener from "../../utilites/homey_device_hooks/checkAndRegisterModeListener";

class TVDevice extends Homey.Device {

    async onInit() {

        let UUID: string = this.getStoreValue('UUID');
        let IP: string = this.homey.env.LOOKinDevice.IP;
        let path: string = `/commands/ir/localremote/${UUID}`;
        let name: string = this.getName();
        let ID: string = this.homey.env.LOOKinDevice.ID;

        await actualiseStatus(this, IP, UUID);

        await checkAndRegisterModeListener(this, IP, UUID, path);
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

        this.registerCapabilityListener('channel_up', async () => {
            await sendRequest(this,'08FF', 'chup', 'channel up', IP, path);
        });

        this.registerCapabilityListener('channel_down', async () => {
            await sendRequest(this,'09FF', 'chdown', 'channel down', IP, path);
        });

        this.registerCapabilityListener('volume_up', async () => {
            await sendRequest(this,'06FF', 'volup', 'volume up', IP, path);
        });

        this.registerCapabilityListener('volume_down', async () => {
            await sendRequest(this,'07FF', 'voldown', 'volume down', IP, path);
        });

        this.registerCapabilityListener('volume_mute', async () => {
            await sendRequest(this,'05FF', 'mute', 'volume mute', IP, path);
        });

        this.registerCapabilityListener('arrow_up_btn', async () => {
            await sendRequest(this,'0C02', 'cursor', 'arrow up', IP, path);
        });

        this.registerCapabilityListener('arrow_down_btn', async () => {
            await sendRequest(this,'0C04', 'cursor', 'arrow down', IP, path);
        });

        this.registerCapabilityListener('arrow_left_btn', async () => {
            await sendRequest(this,'0C01', 'cursor', 'arrow left', IP, path);
        });

        this.registerCapabilityListener('arrow_right_btn', async () => {
            await sendRequest(this,'0C03', 'cursor', 'arrow right', IP, path);
        });

        this.registerCapabilityListener('select_btn', async () => {
            await sendRequest(this,'0C00', 'cursor', 'cursor select', IP, path);
        });

        this.registerCapabilityListener('menu_btn', async () => {
            await sendRequest(this,'0DFF', 'menu', 'menu', IP, path);
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

module.exports = TVDevice;
