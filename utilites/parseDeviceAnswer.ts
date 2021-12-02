const parseDeviceAnswer = (payload: string): string[] => {
    let result = [];
    while (true) {
        let position = payload.indexOf(':');
        if (position === -1) {
            result.push(payload.toString());
            return result;
        } else {
            let add = payload.slice(0, position);
            result.push(add);
            payload = payload.slice(position + 1);
            parseDeviceAnswer(payload);
        }
    }
}

export default parseDeviceAnswer;
