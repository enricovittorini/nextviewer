
const { spawn } = require('child_process');

async function previewFilter(sid) {

    return new Promise((resolve, reject) => {
        console.log("Reconfigure tsp filter for preview for Service Id: " + sid)
        let tspfilter;
        if (sid !== 0) {
            tspfilter = spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '5','--service', sid, '-s'])
        } else {
            tspfilter = spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '5', '--service', '-n'])
        }

        tspfilter.on('exit', (code) => {
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