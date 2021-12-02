import {socket} from './UDPserver';

const sendDiscoverSignal = (msg: string, port: number, ip: string) => {
    socket.setBroadcast(true);
    socket.send(Buffer.from(msg), port, ip, err => {
        if (err) {
            console.log('Error sending discover signal to remote!', err.stack);
        }
        else {
            console.log('The Discover signal was sent!');
        }
    })
}

export default  sendDiscoverSignal;
