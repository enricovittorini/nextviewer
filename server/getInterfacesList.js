const os = require('os');

function getInterfacesList() {
    const interfaceList = os.networkInterfaces();// GET the interface list of the servicer. Extract only IPv4 addresses.
    const ipv4Addresses = [];

    // Iterate through the data
    for (const key in interfaceList) {
        if (interfaceList.hasOwnProperty(key)) {
            // Iterate through the elements in each entry
            for (const element of interfaceList[key]) {
                if (element.family === 'IPv4' && element.address !== "127.0.0.2") {
                    // Add the IPv4 address to the array
                    ipv4Addresses.push(element.address);
                }
            }
        }
    }
    return ipv4Addresses;
}

module.exports = getInterfacesList;