import dgram from 'dgram';
import sendDiscoverSignal from "./sendDiscoverSignal";
import getAllDataFromRemote from "./getAllDataFromRemote";
import {Device} from "./interfaces";
import EventEmitter from 'events';

export const emitter = new EventEmitter();
const PORT = 61201;
const IP = '255.255.255.255';
const ALIVE = /LOOK\.?in:Alive!/;
const UPDATED_DATA = /LOOK\.?in:Updated!\w+:data:/;
const UPDATED_STATUS = /LOOK\.?in:Updated!\w+:87:FE:/;
const UPDATED_METEO = /LOOK\.?in:Updated!\w+:FE:00:\w{8}/;
const DISCOVER = 'LOOK.in:Discover!';

export const socket = dgram.createSocket({type: "udp4", reuseAddr: true});

const udpServer = async (): Promise<Device> => {

    return new Promise((resolve, reject) => {

        socket.on('error', err => {
            reject(console.log('Server error', err.stack));
        });

        socket.on('message', async (msg, rinfo) => {

            if (msg.toString().match(ALIVE)) {
                let alivePayload = msg.toString().replace(ALIVE, '');
                resolve(await getAllDataFromRemote(alivePayload));
            }
            if (msg.toString().match(UPDATED_DATA)) {
                emitter.emit('updated_data', msg.toString());
            }
            if (msg.toString().match(UPDATED_STATUS)) {
                emitter.emit('updated_status', msg.toString());
            }
            if (msg.toString().match(UPDATED_METEO)) {
                emitter.emit('updated_meteo', msg.toString());
            }
        });

        socket.bind(PORT, () => {
            sendDiscoverSignal(DISCOVER, PORT, IP);
            console.log(`Server has been started on port ${PORT}`);
        });

    });

}

export default udpServer;
