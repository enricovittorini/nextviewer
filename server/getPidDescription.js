



async function getPidDescription(sid, allTables) {
    return new Promise((resolve, reject) => {
        let videoDescription = null;

        const service = allTables?.analyze?.services?.find(k => k.id === sid); // get the Serivice
        service?.pids.map(k => {
            allTables.analyze.pids.map(x => {
                if (x.id == k && x.video == true) {
                    videoDescription = x.description;
                    return
                }
            })
        })

        if (videoDescription) {
            resolve(videoDescription.replace(/["()]/g, ''));
        }
    })

}


module.exports = getPidDescription;