const { spawn } = require('child_process');
const readline = require('readline');
const { sendEventsToAll } = require('./sendEvents');
const TablePid = require('./constants');
const srtVesion = require('./getSrtVersion');
const getServicelist = require('./servicelist');
const convertBitrate = require('./convertBitrate');

const probeCtrlPort = 3001; // Probe process control port
let allTables = { "pat": {}, "cat": {}, "pmt": [], "sdt": {}, "sdtOther": [], "bat": {}, "nit": {}, "analyze": {}, "servicelist": {}, "tsbitrate": {}, "srt": {}, "stats": {}, "info": {} };
let oldLateTables = []; // keep track of old tables
const lateTablesPid = [16, 17, 18, 20, 21]; //There are tables with potentially high repetitionrate. Use "analyze" with high interval
tableRepRate = { "16": 0, "17": 0, "18": 0, "21": 0 };

const generalCommand = [
    '-P', 'bitrate_monitor', '-p', '1', '-t', '1','--json-line',
    '-P', 'tables', '--log-json-line', '--psi-si', '--pid', '18', '--pid', '20', '--invalid-versions', '--default-pds', '0x00000028',
    '-P', 'analyze', '--unreferenced-pid-list', '-i', '1', '--json-line',
   // '-P', 'analyze', '--unreferenced-pid-list', '-i', '10', '--json-line=SLOWTAB',
    '-P', 'continuity',
    //'-P', 'analyze', '--unreferenced-pid-list', '-i', '1', '--json-line=ANACONT',
];


async function getAllTables() {
    return new Promise((resolve) => {
        resolve(allTables);
    })
}

//Funciton to clean all the tables
function clearObject(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (Array.isArray(obj[key])) {
                // If the value is an array, clear all elements
                obj[key] = [];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // If the value is an object, set it to an empty object
                obj[key] = {};
            }
        }
    }
}


//IP input 
function ipCommand(config) {
    let params = [

        '-I', config.type, config.ssm ? config.ssm + "@" + config.address + ":" + config.port : config.address + ":" + config.port, '-l', config.interface
    ]

    return (params);
}

//SRT Input
function srtCommand(config) {

    if (config.type === "caller") {
        let params = [
            '-I', 'srt', "--" + config.type, config.address, '--local-interface', config.interface, '--latency', config.latency, '--transtype', 'live', '--messageapi',
            '--statistics-interval', '1000', '--json-line'
        ];

        if (parseInt(config.encryption) !== 0) {

            params.push('--pbkeylen', config.encryption, '--passphrase', config.passphrase)
        }
        return (params);
    } else {

        let params = [
            '-I', 'srt', "--" + config.type, config.interface + ":" + config.port, '--transtype', 'live', '--messageapi',
            '--statistics-interval', '1000', '--json-line'
        ];

        if (parseInt(config.encryption) !== 0) {

            params.push('--pbkeylen', config.encryption, '--passphrase', config.passphrase)
        }

        return (params);
    }
}




// const probeStart = function probeStart(config, tspcommand) {
async function probeStart(config, tspcommand) {

    allTables.info.srtversion = await srtVesion();

    return new Promise((resolve, reject) => {

        if (tspcommand !== null) {
            console.log("Process already running")
            return reject("Already running")
        }

        let commandParam = [];
        //I need to reparse teh bitrate when it goes to "zero" and then resume. I need to restart the plugin "tables"
        let reparseTable = false;

        switch (config.type) {
            case "ip":
                commandParam = ipCommand(config);
                break;
            case "caller":
            case "listener":
                commandParam = srtCommand(config);
                break;

        }

        tspcommand = spawn('tsp', ['--control-port', probeCtrlPort, ...commandParam, ...generalCommand, '-P', 'filter', '-n', '-O', 'ip', '127.0.0.1:3333']);

        //console.log(tspcommand.spawnargs.join(', ').replace(/,/g, ''))

        const ster = readline.createInterface({
            input: tspcommand.stderr,
            output: tspcommand.stdout
        });

        tspcommand.on('message', (code) => {
            console.log("Message: " + code);
        });

        ster.on('line', async (data) => {

            const table = data.substring(2, data.indexOf(":"));

            if (table === "bitrate_monitor") {
                /* *******************************************
                *************** BITRATE PLUGIN  **************
                **********************************************/
                // { "bitrate": 24882317, "net": 23917618, "status": "normal", "stuffing": 964699, "time": "2023/12/12 06:33:34", "type": "ts" }
                console.log(data)

                const jdata = JSON.parse(data.substring(data.indexOf("{")));
                allTables.tsbitrate.bitrate = convertBitrate(jdata.bitrate || 0);
                allTables.tsbitrate.net = convertBitrate(jdata.net || 0);
                allTables.tsbitrate.stuffing = convertBitrate(jdata.stuffing || 0);

                //Define a regular expression pattern to match the required values
                //const regexPattern = /bitrate_monitor: (\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}), TS bitrate: ([\d,]+) bits\/s, net bitrate: ([\d,]+) bits\/s/;

                // Use the RegExp.exec() method to extract values
                //const match = regexPattern.exec(data);
               /* allTables.bitrate["date"] = match[1];
                allTables.bitrate["time"] = match[2];
                

                allTables.bitrate["tsbitrate"] = convertBitrate(match[3].replace(/,/g, ''));
                allTables.bitrate["netbitrate"] = convertBitrate(match[4].replace(/,/g, ''));
                allTables.bitrate["nullbitrate"] = convertBitrate(match[3].replace(/,/g, '') - match[4].replace(/,/g, ''));*/

                if (allTables.tsbitrate.bitrate === "0") {

                    reparseTable = true; // When bitrate goes to 0, this will trigger a reparse of the tables

                    // when bitrate goes to zero, clean allTables
                    clearObject(allTables);


                } else if (reparseTable) {
                    spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '-s', '2']);
                    reparseTable = false;
                }

                //bitrate monitor is the most frequent plugin. Send allTables  only here
                allTables.servicelist = getServicelist(allTables.sdt, allTables.analyze);
                

            }

            if (table === "tables") {

                const j = JSON.parse(data.substring(10));

                if (j["#name"] === "PAT") {

                    //console.log("tables: PAT");

                    j["#nodes"][0]["bitrate"] = 0;

                    // Every time a new PAT is generated, i need to clean the PMT by removing the services not listed in the PAT
                    const serviceIdsA = j["#nodes"]
                        .filter(node => node["#name"] === "service")
                        .map(node => node["service_id"]);

                    allTables.pmt = allTables.pmt.filter(itemB => serviceIdsA.includes(itemB["service_id"]));

                    //Every time i see a PAT, i restart the table plugin to catch cases where a PMT previously removed is added again

                    /*  setTimeout(() => {
                         spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '-s', '2']);
                          
                      }, 2000);*/

                    //Assing j to pat array
                    allTables.pat = j;

                };

                if (j["#name"] === "CAT") {
                    // console.log("tables: CAT")
                    j["#nodes"][0]["bitrate"] = 0;

                    allTables.cat = j;

                };


                if (j["#name"] === "PMT") {
                    //console.log("tables: PMT")
                    j["#nodes"][0]["bitrate"] = 0;

                    //If "j" is already in pmt array, overwrite it. Else push it
                    const idx = allTables.pmt.findIndex(k => k.service_id === j.service_id);
                    if (idx !== -1) {
                        allTables.pmt[idx] = j;
                    } else {

                        allTables.pmt.push(j);
                        //Sort PMT ascending
                        allTables.pmt.sort((a, b) => a.service_id - b.service_id);
                    }

                };


                if (j["#name"] === "SDT") {
                    //console.log("tables: SDT")
                    j["#nodes"][0]["bitrate"] = 0;

                    if (j.actual) {
                        allTables.sdt = j;
                    } else {
                        const onId = j.original_network_id
                        const tsId = j.transport_stream_id
                        const idx = allTables.sdtOther.findIndex(k => (k.original_network_id === onId && k.transport_stream_id === tsId));
                        if (idx > -1) {
                            //sdtOther[idx] = j;
                            allTables.sdtOther[idx] = j;
                        } else {
                            allTables.sdtOther.push(j)
                            allTables.sdtOther.sort((a, b) => a.transport_stream_id - b.transport_stream_id);

                        }
                        // TO DO: sure that push is correct?

                    }

                };

                if (j["#name"] === "BAT") {
                    // console.log("tables: BAT")
                    j["#nodes"][0]["bitrate"] = 0;

                    allTables.bat = j;

                };


                if (j["#name"] === "NIT") {
                    // console.log("tables: NIT")
                    j["#nodes"][0]["bitrate"] = 0;

                    //nit = j //push(j)
                    allTables.nit = j;

                };

            }

            if (table === "analyze") {
                /* **********************************************
                   ********** ANALYZE PLUGIN SECTION ************
                   **********************************************/

                // Use a regular expression to match the value after "analyze: "

                const regex = /analyze: (\w+)/;
                const match = data.match(regex);

                if (match) {

                    const prefix = match[1];

                    if (prefix === "SLOWTAB") {
                        /*---------- SLOW TABLES ------------------------
                        Keep track on the slow tables PIDs in oldLateTables
                        This is used to as these tables cannot be tracked if i analyze the output every seconds. They take more time 
                        */

                        const j = JSON.parse(data.substring(18));

                        // oldLateTables contains the PIDs of the "slow tables" 
                        //Use Set for faster lookups
                        //Use the filter method to create an array (oldLateTables) containing the elements from j.pids whose id is present in the lateTablesPid

                        /*const lateTablesPidSet = new Set(lateTablesPid);
                        oldLateTables = j.pids.filter(pid => lateTablesPidSet.has(pid.id));
                        oldLateTables.forEach(k => {
                            k.bitrate = convertBitrate(k.bitrate);
                        })*/

                        // New
                        //allTables.analyze.pids = j.pids;


                    } else if (prefix === "ANACONT") {

                        /* -------------  ANALYZE CONTINUITY and BITRATE ---------------- */
                        //console.log("ANACONT bitrate");
                        const j = JSON.parse(data.substring(18));

                        const nitPid = j.pids.find(k => k.id === 16);
                        const sdtPid = j.pids.find(k => k.id === 17);
                        const eitPid = j.pids.find(k => k.id === 18);
                        console.log("NIT bitrate: " + convertBitrate(nitPid ? nitPid?.bitrate : 0))
                        console.log("SDT bitrate: " + convertBitrate(sdtPid ? sdtPid?.bitrate : 0))
                        console.log("EIT bitrate: " + convertBitrate(eitPid ? eitPid?.bitrate : 0))

                        if (allTables && allTables.nit && allTables.nit["#nodes"] && allTables.nit["#nodes"][0]) {
                            allTables.nit["#nodes"][0]["bitrate"] = convertBitrate(nitPid ? nitPid.bitrate : 0);
                        }
                        //sendEventsToAll('allTables', allTables);
                    }

                } else {

                    const j = JSON.parse(data.substring(10));

                    function setBitrateTables(target, id) {

                        //Retrieve the bitrate value form the analyze.pid and convert it
                        const pid = allTables?.analyze?.pids?.length > 0 && allTables.analyze.pids.find(k => k["id"] === id);
                        let tableBitrate = 0;
                        if (typeof pid?.bitrate === 'number') {

                            tableBitrate = convertBitrate(pid?.bitrate ? pid.bitrate : 0);
                        } else {
                            tableBitrate = pid?.bitrate && pid.bitrate;
                        }

                        if (target["#nodes"] && target["#nodes"][0]) {
                            target["#nodes"][0]["bitrate"] = tableBitrate;
                        }


                    }

                  
                    if (allTables?.analyze?.pids) {
                        // PAT
                        setBitrateTables(allTables.pat, TablePid.PAT);

                        // CAT
                        setBitrateTables(allTables.cat, TablePid.CAT);

                        // PMTs
                        allTables.pmt.forEach(k => {
                            setBitrateTables(k, k["#nodes"][0].pid);
                        });

                        // NIT
                        //setBitrateTables(allTables.nit, TablePid.NIT);
                        //New
                        const nitPid = j.pids.find(k => k.id === 16);
                        if (allTables && allTables.nit && allTables.nit["#nodes"] && allTables.nit["#nodes"][0]) {
                            allTables.nit["#nodes"][0]["bitrate"] = convertBitrate(nitPid ? nitPid.bitrate : 0);
                        }

                        // SDT and BAT
                        const sdtPid = j.pids.find(k => k.id === 17);
                        if (allTables && allTables.sdt && allTables.sdt["#nodes"] && allTables.sdt["#nodes"][0]) {
                            allTables.sdt["#nodes"][0]["bitrate"] = convertBitrate(sdtPid ? sdtPid.bitrate : 0);
                        }

                    }


                    //----- New ----------------
                    const threshold = 10;

                    if (!allTables.analyze.pids){
                        console.log("PIDS list is empty. Filling it")
                        allTables.analyze.pids = j.pids;
                    }

                    // Iterate over analyze.pids array in reverse order
                    /* If check if the PID in analyze.pid is present in j.pids
                        - if yes, replace the element in analyze.pids with j.pids and updated the bitrate
                        - it not, set the missingCout and increment it
                    finally, if the missingcount is more than the threshold, remove it */
                    for (let index = allTables.analyze?.pids?.length - 1; index >= 0; index--) {
                        const analyzePid = allTables.analyze.pids[index];
                        const jPid = j.pids.find((jItem) => jItem.id === analyzePid.id);

                        if (jPid) {
                            allTables.analyze.pids[index] = {
                                ...jPid,
                                bitrate: convertBitrate(jPid.bitrate),
                            };
                        } else {
                            analyzePid.missingCount = (analyzePid.missingCount || 0) + 1;
                            analyzePid.bitrate = convertBitrate(0);
                            console.log("PID is late: " + analyzePid.id + ",missing count is: " + analyzePid.missingCount)

                            if (analyzePid.missingCount > threshold) {
                                // Remove the object from analyze.pids
                                console.log("Removing PID: " + analyzePid.id)
                                allTables.analyze.pids.splice(index, 1);
                                
                            }
                        }
                    }

                    // Iterate over j.pids array to find and add new objects to analyze.pids
                    j.pids.forEach((jPid) => {
                        if (!allTables.analyze?.pids?.find((analyzePid) => analyzePid.id === jPid.id)) {
                            allTables.analyze?.pids?.push({
                                ...jPid,
                                bitrate: convertBitrate(jPid.bitrate),
                                missingCount: 0,
                            });
                        }
                    });


                    allTables.analyze?.pids?.sort((a, b) => a.id - b.id);

                    //----- END New ----


                    allTables.analyze.services = j.services;

                }


            }

            if (table === "srt") {
                try {
                    const j = JSON.parse(data.substring(7));
                    allTables.srt = j
                } catch (e) {
                    console.log("Error in parsing SRT json line");
                    console.log(data.substring(7));
                    allTables.srt = {};
                }

            }

            /*The nullish ?? coalescing operator checks if allTables.stats.cc is null or undefined and, 
            if so, uses the default value of 0. Then, it increments the result by 1. */
            if (table === "continuity") {
                allTables.stats.cc = (allTables.stats.cc ?? 0) + 1;
            }

            sendEventsToAll('allTables', allTables);
        });

        resolve(tspcommand)

    });

}


//const probeStop = function probeStop(tspcommand) {
function probeStop(tspcommand) {

    // I need to delay the clear table when the probe is stopped as the there is still soemting to send
    const dealyClean = setTimeout(() => {

        //console.log("Waiting to clear tables")
        clearObject(allTables)
        //console.log("Sending clean tables")
        sendEventsToAll('allTables', allTables);

    }, 1000)

    return new Promise((resolve, reject) => {


        //If there is no probe running, return 
        if (tspcommand === null) { return reject("Nothing to stop") }

        //Try to stop the process gracefully
        const stopcommand = spawn('tspcontrol', ['-t', '127.0.0.1:3001', 'exit']);

        stopcommand.on('close', async (code) => {
            //If cannot stop gracefully, try to kill it
            if (code !== 0) {

                try {
                    const probeKill = await tspcommand.kill(); // kill return true if kill() suceed
                    if (probeKill) {
                        console.log("Probe Process killed. Code: " + code);

                        dealyClean
                        return (resolve(null));

                    } else {
                        console.log("Could not Kill the probe process")
                        dealyClean
                        return reject(null);
                    }
                } catch (e) {
                    console.log("Impossible to kill the probe pid")
                    console.log(e);

                }

            } else {
                //If stop gracefully, resolve with code
                console.log("Probe process stop gracefully with code: " + code)
                dealyClean
                return resolve(null)

            }
        });


        stopcommand.on('exit', (code) => {
            if (code == 0) {
                console.log(`Probe process EXITED with code ${code}`);
                //allTables = {...allTablesClean};

                return resolve(null);
            } else {
                console.log("Probe process EXITED with non-zero code: " + code)
            }
        });
    });

}



// FFMPEG IFRAME

async function ffmpegIframe() {

    return new Promise((resolve, reject) => {

        const frame_resolution = '640:360';
        const frame_interval = 3;

        try {
            var ffmpeg = spawn('ffmpeg', ['-hide_banner', '-loglevel', '1', '-i', 'udp://127.0.0.1:3333',
                '-vf', 'select=\'eq(pict_type\,PICT_TYPE_I)\',scale=' + frame_resolution + ',fps=1/' + frame_interval + '',
                '-q:v', '4', '-f', 'image2', '-update', '1', '-']);

            ffmpeg.stdout.on('data', (data) => {

                let prefix = "data:image/jpeg;base64,"
                sendEventsToAll('previewImage', prefix.concat("", data.toString('base64')));
            })

            ffmpeg.on('error', (err) => {
                console.log('Failed to start preview process.');
                console.log(err)
            });

            ffmpeg.stderr.on('data', (data) => {
                console.log("FFMPEG sterr: ")
                console.log(data)

            });


            resolve(ffmpeg);

        } catch (e) {
            reject(null)
        }

    })
}




module.exports = { probeStart, probeStop, ffmpegIframe, getAllTables }