function bitrateMonitor(allTables, reparseTables) {
    //sendData = true;
 

    //Define a regular expression pattern to match the required values
    const regexPattern = /bitrate_monitor: (\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}), TS bitrate: ([\d,]+) bits\/s, net bitrate: ([\d,]+) bits\/s/;

    // Use the RegExp.exec() method to extract values
    const match = regexPattern.exec(data);
    allTables.bitrate["date"] = match[1];
    allTables.bitrate["time"] = match[2];
    allTables.bitrate["tsbitrate"] = match[3];
    allTables.bitrate["netbitrate"] = match[4];

    if (allTables.bitrate.tsbitrate === "0") {

        if (reparseTables) {
            spawn('tspcontrol', [
                '-t', 'localhost:3001',
                'restart', '-s', '2'
            ]);

            reparseTables = false;
        }

        allTables = {...cleanTable};


    } else {
        reparseTables = true;
    }

    //bitrate monitor is the most frequent pluging. Send allTables  only
     sendEventsToAll('allTables', allTables);

}

module.export = bitrateMonitor