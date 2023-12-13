const express = require('express');
const rewrite = require('express-urlrewrite');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { probeStart, probeStop, ffmpegIframe, getAllTables } = require('./probe_start_stop');
const { getClients, addClient, filterClient } = require('./clients');
const previewFilter = require('./previewFilter');
const getPidDescription = require('./getPidDescription');
const { sendEventsToAll, sendEventsToOne } = require('./sendEvents');
const getInterfacesList = require('./getInterfacesList');
const { allowedNodeEnvironmentFlags } = require('process');
const { spawn } = require('child_process');
const readline = require('readline');
//const { get } = require('http');

const serverPort = 8081;
const nopreview = 'data:image/jpeg;base64,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'
const ipv4Addresses = getInterfacesList();
let tspcommand = null;
let previewcommand = null;
let resetcc = null;

//Probe configuration parameters
let config = {
    "type": "ip",
    "ssm": null,
    "address": null,
    "port": null,
    "interfaceList": ipv4Addresses || null,
    "interface": null,
    "dektec":
    {
        "DTU-245": {
            "io-stream": "ASI",
            "deviceIndex": [],
            "channel": [0],

        },
    },
    "status": "stopped",
    "previewSid": 0,
    "description": "",
    "appversion": null
}



const app = express();

//Needed to simplify the deployment on K8s clsuter with Ingress: path rule msut be /nextviewer
app.use(rewrite('/nextviewer/*', '/$1'));

app.use(cors());
app.use(bodyParser.json()); // Add body-parser middleware to handle JSON data


//-----------------------Uncomment for the build version -------------------------------//

//const staticPath = path.join(__dirname, '../client/build');
const staticPath = path.join(__dirname, '../client/out');
app.use(express.static(staticPath));


/* Server version */
config.appversion = process.env.npm_package_version;

/* DEKTEC DEVICE */
//0: DTU-245 (DTU-245 FantASI USB-2 ASI/SDI Input+Output)
const tspdek = spawn('tsdektec', ['-a']);

const stout = readline.createInterface({
    input: tspdek.stdout,
    output: tspdek.stdout
});
stout.on('line', (data) => {

    //console.log(data)
    const line = data.split(":");
    const deviceIndex = parseInt(line[0]);
    //console.log(deviceIndex)
    const deviceType = line[1].substr(0, line[1].indexOf("(")).trim();
    //console.log(deviceType)
    config.dektec[`${deviceType}`].deviceIndex.push(deviceIndex);
    //console.log(config)
})
/* END DEKTEC DEVICE */

/* SSE EVENTS */

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache,no-transform',
        'X-Accel-Buffering': 'no'
    };
    response.writeHead(200, headers);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    //clients.push(newClient);
    addClient(newClient);
    config.interfaceList = getInterfacesList() || null;
    //sendEventsToAll("config", config);
    //sendEventsToAll("allTables", getAllTables());
    sendEventsToOne(newClient, "config", config);
    sendEventsToOne(newClient, "allTables", getAllTables());
    sendEventsToOne(newClient, 'previewImage', nopreview);
    sendEventsToOne(newClient, 'description', config.description ? config.description : '');

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        filterClient(clientId)
    });
}


app.get('/events', eventsHandler);


//---------- END SSE EVENTS ---------- //

app.route('/config')
    // GET Probe Config Parameters
    .get((req, res) => {
        res.json(config);
    })
    //POST Probe Config Parameters
    .post((req, res) => {
        // Access the posted data from the request body
        const formData = req.body;
        config = formData;
        // Send a response to the client
        res.json(config);
    })


// START Probe
app.post('/start', async function (req, res) {
    try {

        tspcommand = await probeStart(config, tspcommand);
        config.status = "running";
        config.previewSid = 0; // When i start the probe i need to set the preview to 0 = No Preview
        sendEventsToAll('config', config);

    } catch (e) {
        console.log("Failes to start the probe");
        console.log(e);
    }

    res.json(config);
})


// STOP Probe
app.post('/stop', async function (req, res) {

    try {

        tspcommand = await probeStop(tspcommand);
        //Check if preview process is running and stop it
        if (previewcommand) {
            await previewcommand.kill();
            previewcommand = null;
            config.previewSid = 0;
            sendEventsToAll('previewImage', nopreview);
            sendEventsToAll('description', " ");
        }

        config.status = "stopped";

        sendEventsToAll('config', config);



    } catch (e) {
        tspcommand = null;
        previewcommand = null;
        config.status = "stopped";
        console.log(e)
    }

    res.json(config);
})


// POST Preview
app.post('/startpreview', async function (req, res) {

    try {
        const sid = req.body;

        const pidDescription = getPidDescription(sid.sid, await getAllTables());
        pidDescription.then((description) => {
            console.log(description)
            config.description = description;


        });

        if (config.status === "running") { // Check if probe is running.

            // Rconfigure TSP filter. 
            try {

                // reconfigure tsp to filter the desired Service Id
                await previewFilter(sid.sid);

                //previewSid is 0 if user does not want preview. So i can start a new  ffmpeg process.
                // if previewSid is not 0, i have to kill first the process then start a new one.
                if (config.previewSid === 0) {
                    previewcommand = await ffmpegIframe();

                    if (previewcommand) {
                        config.previewSid = sid.sid;

                        sendEventsToAll('config', config);
                        sendEventsToAll('description', config.description)
                        res.json(config);
                    }
                } else {
                    //If preview is already running, kill the ffmpeg process and start a new one 
                    console.log("START PREVIEW: Kiilling ffmpeg")

                    // Wrap in a Promise to wait for previewcommand.kill() to complete
                    await new Promise(resolve => {
                        previewcommand.kill();

                        previewcommand.on('close', async (code, signal) => {
                            console.log(`child process terminated due to receipt of signal ${signal}`);
                            resolve();
                        });
                    })

                    // Start a new ffmpeg process
                    config.previewSid = 0;
                    previewcommand = await ffmpegIframe();

                    if (previewcommand) {
                        config.previewSid = sid.sid;

                        sendEventsToAll('config', config);
                        sendEventsToAll('description', config.description);
                        res.json(config);
                    }

                }

            } catch (e) {
                console.log("Failed to reconfigre tsp filter")
            }

        }

    } catch (e) {

        console.log("Error in starting preview: " + e);
        res.status(500).send(e);

    }
})


app.post('/stoppreview', async function (req, res) {

    try {

        console.log("STOP PREVIEW: Kiilling ffmpeg")
        previewcommand.kill();

        previewcommand.on('close', async (code, signal) => {
            console.log(`Preview process terminated due to receipt of signal ${signal}`);
            config.previewSid = 0;
            config.description = "";
            sendEventsToAll('config', config);
            sendEventsToAll('previewImage', nopreview);
            sendEventsToAll('description', " ");
            res.json(config);

        });

    } catch (e) {

        console.log("Error in stopping preview: " + e);
        res.status(500).send(e);

    }
})



//POST Reset CC Counter
app.post('/resetcc', async function (req, res) {
    try {
        const tables = await getAllTables();
        if (tables && tables.stats) {
            if (!resetcc) {
                resetcc = spawn('tspcontrol', ['-t', 'localhost:3001', 'restart', '-s', '4']);

                resetcc.on('exit', async (code) => {
                    if (code === 0) {
                        tables.stats.cc = 0;
                        sendEventsToAll(tables);
                        
                    }
                    resetcc = null;
                })
            }

        }
        res.status(200).end();
    }
    catch (e) {
        console.error('Error in /resetcc:', e);
        res.status(500).send('Internal Server Error').end();
    }
})



// Tutte le altre richieste di tipo GET non gestite dal metodo precedente, restituiranno l'applicazione REACT
app.get('*', (req, res) => {
    //res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));

    res.sendFile(path.resolve(__dirname, '../client/out', 'index.html'));
})


const PORT = process.env.PORT || serverPort;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
