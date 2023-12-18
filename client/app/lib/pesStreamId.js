
function getPesStreamId(id) {
    const idIconMap = {
        189: "bi bi-card-text",
        192: "bi bi-music-note-beamed",
        224: "bi bi-film",
        240: "bi bi-key",
        241: "bi bi-shield-lock",
        242: "bi bi-app-indicator",
    };

    return idIconMap[id] || null;
}

module.exports = getPesStreamId;