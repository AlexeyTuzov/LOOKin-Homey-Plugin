import Homey from 'homey';
import {emitter} from "../../utilites/UDPserver";

class MeteoSensor extends Homey.Device {

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

    async onAdded() {
        let name: string = this.getName();
        this.log(`${name} has been added`);
    }

    async onSettings({oldSettings: {}, newSettings: {}, changedKeys: {}}): Promise<string | void> {
        let name: string = this.getName();
        this.log(`${name} settings were changed`);
    }

    async onRenamed(name: string) {
        this.log(`Sensors was renamed to ${name}`);
    }

    async onDeleted() {
        let name: string = this.getName();
        this.log(`${name} has been deleted`);
    }

}

module.exports = MeteoSensor;
