
const { getClients, addClient, filterClient } = require('./clients');

async function  sendEventsToAll(eventName, newData) {
    let clients = getClients();
    clients.forEach(client => {
        client.response.write(`event: ${eventName}\n`);
        client.response.write(`data: ${JSON.stringify(newData)}\n\n`);

    })
}

async function  sendEventsToOne(client, eventName, newData) {
    //let clients = getClients();
    //clients.forEach(client => {
        client.response.write(`event: ${eventName}\n`);
        client.response.write(`data: ${JSON.stringify(newData)}\n\n`);

    //})
}

module.exports = {sendEventsToAll, sendEventsToOne}