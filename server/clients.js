// clients.js

var clients = [];

 function getClients() {
  return clients;
}

function addClient(client) {
  clients.push(client);
}

 function filterClient(clientId){
    clients = clients.filter(client => client.id !== clientId);
}


module.exports = {
  getClients,
  addClient,
  filterClient
};
