
const { spawn } = require('child_process');

async function previewFilter(sid) {

    return new Promise((resolve, reject) => {
        console.log("Reconfigure tsp filter for preview for Service Id: " + sid)
        let filter;
        if (sid !== 0) {
            filter = spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '6', '--service', sid, '-s'])
        } else {
            filter = spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '6', '--service', '-n'])
        }

        filter.on('exit', (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(false);
            }

            // console.log("Preview filter configuration exited with code: " + code)

        })

    })

}


module.exports = previewFilter