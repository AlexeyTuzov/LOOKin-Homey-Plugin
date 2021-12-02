import Homey from 'homey';
import udpServer from './utilites/UDPserver'
import {Device} from "./utilites/interfaces";

export class LOOKinApp extends Homey.App {

    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        try {
            setTimeout( () => {
                if (!this.homey.env.LOOKinDevice) this.homey.app.error('Connection timeout exceeded! Check network connection of LOOKin remote!');
            }, 10000);
            this.homey.env.LOOKinDevice = await udpServer();

        } catch (err: any) {
            console.log('UDP server error:', err.stack);
        }
        this.log('The App has been initialized');

    }

}


module.exports = LOOKinApp;
