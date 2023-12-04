const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { probeStart, probeStop, ffmpegIframe, getAllTables } = require('./probe_start_stop');
const { getClients, addClient, filterClient } = require('./clients');
const previewFilter = require('./previewFilter');
const getPidDescription = require('./getPidDescription');
const { sendEventsToAll, sendEventsToOne } = require('./sendEvents');
const getInterfacesList = require('./getInterfacesList');

const serverPort = 8081;
const nopreview = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAPTGF2YzYwLjMuMTAwAP/bAEMACDIyOzI7REREREREUUtRVFRUUVFRUVRUVFpaWmpqalpaWlRUWlpkZGpqc3ZzbW1qbXZ2fX19lpaPj6+vtdfX///EAHQAAQADAQEBAQEAAAAAAAAAAAAGBwQFAQMCCAEBAAAAAAAAAAAAAAAAAAAAABABAAICAAQDBQYEBwEAAAAAAAECAxESBCExQVFhInGREzKhwbHR8RRSI4FzM0I0koLwckMRAQAAAAAAAAAAAAAAAAAAAAD/wAARCAC0AUADASIAAhEAAxEA/9oADAMBAAIRAxEAPwD+fwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtrS1t8NZnXfUTOmIAa+G2uLU67b10+LIAAAOnXHe/wBNbW90TP4NXycsf/O/+2fyBwh68AAAAAGqa2rrcTG+sbjW49GUAAAAAAAAAAAAAAAAAAAAAAAAF08hbgjNb+Gu/htG+axRSYvT6L9Y9J8nS5T/AA+Y/tz+EveVvGSs4L9rfTPlYHk/6Kv9z80TxcvfLEzGorH+a06hPMtJx8rw27xk/Ni5n2cHL1jtNdz6z0/MEVyctkxRxdLV/irO4Q9bXJ9YzVn6ZpMz71SgubBaacrltWdTFo6/BDo5vPE/XKcctaKctltNYtq0dJ7T2cT95Eda4cUT56/QHU5vHx5MWoitskRuPWfNGbcpkpFpmaRrfTfWYjxiNM1MlsvMY7Wnc8dfxe83O89/fr7AfLHy2TJXi9mtfO06hiy4L4dcWtT2mOsSuLma4Z4K2yzSK1jVeGZj39Eam2CuC+OMvHud19m0an4Ar3JhtiikzMTF43Ex+kPK4bWx2ybiK16dfGfTomlf5vKzHjincf8Amf8AsvOY/lYcWLxn27e+ewOBnjJFcXHaJiaRw68I6dJ6R97RTlMlqxaZrSJ7cU62leaIn9pE9prWJ+x1+arhvlnjzTWYiI4eCZ10BUd8N8dorbpvtPh79vhlxWw3mltbjy7dU/zXxfIrSuTjmtunszHTy6w781+fblr+cat/w6/b1BV+bBfBri11jfT9IZL4rY60tOvbjcR469ei18s/usUTHeuWa/0tPT7kM5y0Tl4Y7UiKx/QFegAAAAAAAAAAAAAAAAAAAm2DNXHXLE79uuo17p79UMjo/AC18/Nxmw1rMTxbiZnprpv1+5zMeek44x5azasfTMfVCuwFk2z0pSaYazXi+q1u8x5K2AE5pmrXBkxzE7tMTHl4eqDADq47RS9LT2raJ+EtWa8ZMlrRvUz4uAAsyM+PJStc1bTw9ItXvrynbLkz0+X8vFWa1mdzM95V6AmHL5ow33aN1mJi0ejDnyfOyWv59vd4I6Am2bNGSuKI3E0rETvz6durvTnw5tTmpbiiNcVNdfftVYCc5s9b1rSleGlfjM+rr4OajFitSYmZ68M9OkzGvNV4CyeV5iuDi4omYnXbXePfKvrTNpmZ7zO/izgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z'
const ipv4Addresses = getInterfacesList();
let tspcommand = null;
let previewcommand = null;

//Probe configuration parameters
let config = {
    "type": "ip",
    "address": null,
    "port": null,
    "interfaceList": ipv4Addresses || null,
    "interface": null,
    "status": "stopped",
    "previewSid": 0,
    "description": null,
}



const app = express();
app.use(cors());
app.use(bodyParser.json()); // Add body-parser middleware to handle JSON data


//-----------------------Uncomment for the build version -------------------------------//

//const staticPath = path.join(__dirname, '../client/build');
const staticPath = path.join(__dirname, '../client/out');
app.use(express.static(staticPath));


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

    //sendEventsToAll("config", config);
    //sendEventsToAll("allTables", getAllTables());
    sendEventsToOne(newClient, "config", config);
    sendEventsToOne(newClient, "allTables", getAllTables());
    sendEventsToOne(newClient, 'previewImage', nopreview);

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
        }

        config.status = "stopped";

        sendEventsToAll('config', config);



    } catch (e) {
        tspcommand = null;
        previewcommand = null;
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
            config.description = description;

            sendEventsToAll('description', description)
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
                        res.json(config);
                    }
                } else {
                    //If preview is already running, kill the ffmpeg process and start a new one 
                    console.log("Kiilling ffmpeg")

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

        console.log("Kiilling ffmpeg")
        previewcommand.kill();

        previewcommand.on('close', async (code, signal) => {
            console.log(`Preview process terminated due to receipt of signal ${signal}`);
            config.previewSid = 0;
            sendEventsToAll('config', config);
            sendEventsToAll('previewImage', nopreview);
            res.json(config);

        });

    } catch (e) {

        console.log("Error in stopping preview: " + e);
        res.status(500).send(e);

    }
})




app.post('/resetcc', async function (req, res) {
    try {
        const tables = await getAllTables();
        if (tables && tables.stats) {
            tables.stats.cc = 0;
            sendEventsToAll(tables);
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
