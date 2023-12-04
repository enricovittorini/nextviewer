const { spawn } = require('child_process');

//Command to get the SRT version
function srtVesion() {
    return new Promise((resolve, reject) => {

        try {
            
            const srtCommand = spawn('tsp', ['--version=srt']);
            srtCommand.stderr.on('data', async (line) => {
                const versionMatch = String(line).match(/version\s+([\d.]+)/);
                const srtVer = versionMatch[1] || null;

                resolve(srtVer);

            })
        } catch (e) {
            console.log(e);
            reject(null);
        }

    })

}

module.exports = srtVesion;