import Homey from 'homey';
import {emitter} from "../../utilites/UDPserver";

class MeteoSensor extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {

        let name: string = this.getName();
        let ID: string = this.homey.env.LOOKinDevice.ID;

        const METEO_UPDATE_EXPRESSION: string = String.raw`LOOK\.?in:Updated!${ID}:FE:00:\w{8}`;
        emitter.on('updated_meteo', async (msg: string) => {
            if (msg.match(RegExp(METEO_UPDATE_EXPRESSION))) {
                let measuredTemp = parseInt(msg.slice(-8, -4), 16) / 10;
                let measuredHumidity = parseInt(msg.slice(-4), 16) / 10;
                await this.setCapabilityValue('measure_temperature', measuredTemp).catch(this.error);
                await this.setCapabilityValue('measure_humidity', measuredHumidity).catch(this.error);
            }
        });

        this.log(`${name} has been initialized`);
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        let name: string = this.getName();
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
        let name: string = this.getName();
        this.log(`${name} settings were changed`);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name: string) {
        this.log(`Sensors was renamed to ${name}`);
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        let name: string = this.getName();
        this.log(`${name} has been deleted`);
    }

}

module.exports = MeteoSensor;
