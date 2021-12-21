import {Functions} from "../interfaces";
import httpRequest from "../httpRequest";
import {Device} from "homey";

/**
 * This function is called each time, capability has been changed.
 * It checks for the corresponding function of remote controller in LOOKin APP and trying to send a request.
 * If no such function added in LOOKin APP or request has been rejected - the New error is thrown
 */

const sendRequest = async (device: Device, command: string, alias: string, commName: string, IP: string, path: string): Promise<any> => {
    if (alias && !(device.getStoreValue('functions').find((item: Functions) => item.Name === alias)) || !command) {
        device.error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
        throw new Error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
    }
    let reqCheck = await httpRequest(IP, `${path}${command}`);
    if (JSON.parse(reqCheck).success === 'false') {
        device.error(`Failed to change the ${commName}! No connection to remote`);
        throw new Error(`Failed to change the ${commName}! No connection to remote`);
    }
}

export default sendRequest;
