import * as http from 'http';

const httpRequest = async (IP: string, path: string): Promise<string> => {

    return new Promise((resolve, reject) => {

        try {
            http.get({ host: IP, path: path }, res => {
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
        } catch (err: any) {
            console.log('HTTP Request has failed!');
            reject(console.log('HTTP GET Request Error:', err.stack));
        }
    });

}

export default httpRequest;
