
function getServiceType(typeId) {
    const typeIconMap = {
        1: "bi bi-tv",
        2: "bi bi-mic",
        22: "bi bi-tv",
        25: "bi bi-tv",
    };

    return typeIconMap[typeId] || null;
}


function getServiceTypeHuman(typeId) {
    const typeIconMap = {
        1: "Digital television",
        2: "Digital radio sound",
        22: "Advanced codec SD digital television",
        25: "Advanced codec HD digital television",
    };

    return typeIconMap[typeId] || null;
}




module.exports = {getServiceType, getServiceTypeHuman};