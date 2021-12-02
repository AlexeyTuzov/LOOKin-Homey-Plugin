import * as http from 'http';


const httpRequest = async (IP: string, path: string): Promise<string> => {

    return new Promise( (resolve, reject) => {

        http.get({host: IP, path: path}, res => {
            let data: string = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
            res.on('error', err => {
                reject(console.log(err.stack));
            });
        });
    });
}

export default httpRequest;
