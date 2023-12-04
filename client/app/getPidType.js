
function getPidType(data) {
    let icon = null;
    let tabledPid = [0, 1, 16, 17, 18, 20, 21];
    let description = data.description.substring(0, data.description.indexOf("(")).trim() || data.description;
    let descriptionDetails = data.description.substring(data.description.indexOf("("), data.description.length).replace(/[()]/g, '') || description;

    if (data.pmt || tabledPid.includes(data.id) || data.id === 0) {
        icon = "bi bi-table";
        description = data.description;
    } else if (data.id === 8191) {
        icon = "bi bi-recycle";

    } else if (data.audio) {
        icon = "bi bi-music-note-beamed";

    } else if (data.video) {
        icon = "bi bi-film";

    } else if (data.ecm) {
        icon = "bi bi-key";

    } else if (data.emm) {
        icon = "bi bi-shield-lock";

    } else if (data.unreferenced) {
        icon = "bi bi-question-square";

    } else if (data.language && !data.audio) {
        icon = "bi bi-card-text"; //language can be found on audio or subtitles PID. If audio is false then it must be a subtitle

    } else {
        icon = "bi bi-app-indicator"; // if the conditions above are not veriefied, but there is ssu-oiut key, then it is an SSU pid
        if (data["ssu-oui"]) {
            description = "User private - ssu-oui";
            descriptionDetails = `OUI: ${data["ssu-oui"].join(', ')}`;
        }
    }


    return [icon, description, descriptionDetails];
}

module.exports = getPidType;