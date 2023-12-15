async function getPidDescription(sid, allTables) {
    return new Promise((resolve, reject) => {
        let videoDescription = null;

        const service = allTables?.analyze?.services?.find(k => k.id === sid); // get the Service
        service?.pids.forEach(k => {
            allTables.analyze.pids.forEach(x => {
                if (x.id == k && x.video == true) {
                    videoDescription = x.description;
                    //console.log(videoDescription);
                    return;
                }
            });
        });

        if (videoDescription) {
            resolve(videoDescription.replace(/["()]/g, ''));
        } else {
            reject(new Error('Video description not found'));
        }
    });
}


module.exports = getPidDescription;