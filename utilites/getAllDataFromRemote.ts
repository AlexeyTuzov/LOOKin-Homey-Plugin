import {Device} from "./interfaces";
import parseDeviceAnswer from "./parseDeviceAnswer";
import getSavedRemoteControllers from "./getSavedRemoteControllers";

enum ANSWER {
    ID, type, onBatteries, IP, autoVersion, storageVersion
}

const getAllDataFromRemote = async (payload: string): Promise<Device> => {

    let answerArray: string[] = parseDeviceAnswer(payload);
    let device: Device = {
        ID: answerArray[ANSWER.ID],
        type: answerArray[ANSWER.type],
        onBatteries: answerArray[ANSWER.onBatteries],
        IP: answerArray[ANSWER.IP],
        autoVersion: answerArray[ANSWER.autoVersion],
        storageVersion: answerArray[ANSWER.storageVersion]
    }
    device.savedRC = await getSavedRemoteControllers(device.IP);
    return device;
}

export default getAllDataFromRemote;
