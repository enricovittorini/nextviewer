/* SSE EVENTS */
const { getClients, addClient, filterClient } = require('./clients');
const sendEventsToAll = require('./sendEvents');

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    //clients.push(newClient);
    addClient(newClient);

    sendEventsToAll("config", config);
    sendEventsToAll("allTables", getAllTables());

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        filterClient(clientId)
    });
}

module.exports =  eventsHandler;