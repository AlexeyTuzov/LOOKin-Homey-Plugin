import {Functions} from "./interfaces";
import httpRequest from "./httpRequest";

interface modesResponse {
    Type: string,
    Signals: any[];

}

const getNumberOfModes = async (UUID: string, IP: string, functionsArray: Functions[]): Promise<number> => {
    let modeFunction = functionsArray.filter(item => item.Name === 'mode')[0];
    if (modeFunction.Type === 'single') {
        return 1;
    }
    let response: modesResponse = JSON.parse(await httpRequest(IP, `/data/${UUID}/mode`));
    return response.Signals.length;

}

export default getNumberOfModes;
