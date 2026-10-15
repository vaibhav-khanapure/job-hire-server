import { UAParser } from 'ua-parser-js';

const getDeviceName = (userAgent: string | undefined): string => {
    if (!userAgent) {
        return 'Unknown Device';
    };

    const { browser, os, device } = UAParser(userAgent);

    const deviceType = device.type
        ? device.type.charAt(0).toUpperCase() + device.type.slice(1)
        : 'Desktop';

    const deviceName = device.model
        ? `${device.vendor ?? ''} ${device.model}`.trim()
        : deviceType;

    const browserName = browser.name ?? 'Unknown Browser';
    const osName = os.name ?? 'Unknown OS';

    return `${deviceName} - ${browserName} on ${osName}`;
};

export default getDeviceName;