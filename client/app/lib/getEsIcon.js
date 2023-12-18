const getEsIcon = function (id) {
    if (id == null) {
        return null;
    }

    const idIconMap = {
        "3": "bi bi-music-note-beamed",
        "4": "bi bi-music-note-beamed",
        "5": "bi bi-code-square",
        "6": "bi bi-card-text",
        "11": "bi bi-app-indicator",
        "12": "bi bi-app-indicator",
        "15": "bi bi-music-note-beamed",
        "17": "bi bi-music-note-beamed",
        "27": "bi bi-film",
    };

    return idIconMap[id.toString()] || "bi bi-question-circle";
};

module.exports = getEsIcon;
