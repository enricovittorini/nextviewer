/*
This function generate an EIT Table with the following strucutre

[
	{
		"properties": {
			"actual": true,
			"current": true,
			"last_table_id": 78,
			"original_network_id": 29,
			"service_id": 65,
			"transport_stream_id": 512,
			"type": "pf",
			"version": 20
		},
		"events": [
			{
				"properties": {
					"ca_mode": false,
					"duration": "00:20:00",
					"event_id": 3901,
					"running_status": "running",
					"start_time": "2022-03-09 11:00:00"
				},
				"short_description":{
					"name": "",
					"description":""
					"language_code":""
				},
				"long_description":{
					
				}
				
			}
		]
	}
]


*/



function createEIT(eit) {
    const table = {};
    table.properties = {};
    table.events = [];

    // GET EIT properties and map to table.properties
    table.properties = {
        "actual": eit.actual,
        "current": eit.current,
        "last_table_id": eit.last_table_id,
        "original_network_id": eit.original_network_id,
        "service_id": eit.service_id,
        "transport_stream_id": eit.transport_stream_id,
        //"type": eit.type, exlucde type, not needed
        "version": eit.version
    };

    //Iterate over events
    //First fitler the events by excluding the metadata node and interate over them
    const eventList = eit["#nodes"]?.filter(k => k["#name"] !== "metadata");
    //console.log(eit)
    eventList.forEach((el, index) => {

        const event = {};

        //Collect Event Properties
        event.properties = {};

        // get Event Propoerties
        event.properties.event_id = el.event_id;
        event.properties.duration = el.duration;
        event.properties.running_status = el.running_status;
        event.properties.start_time = el.start_time;
        event.properties.ca_mode = el.ca_mode;


        //Get Short Description
        event.short_description = {}
        const shortArr = el?.["#nodes"].find( k => k["#name"] === "short_event_descriptor");
        
        const nodeName = shortArr?.["#nodes"].find(k => k["#name"] === "event_name");
        event.short_description.name = nodeName?.["#nodes"][0];

        const nodeDesc = shortArr?.["#nodes"].find(k => k["#name"] === "text");
        event.short_description.description = nodeDesc?.["#nodes"][0];

        event.short_description.language_code = shortArr?.language_code;

        //Get Long Description
        const LongtArr = el["#nodes"].filter( k => k["#name"] === "extended_event_descriptor");
        event.long_description = {};
        //Iterate through LongArr
        let descr = "";
        LongtArr.forEach(x => {
           descr = descr.concat(x["#nodes"][0]["#nodes"]);
           event.long_description.language_code = x.language_code;

        })

        event.long_description.description = descr;

        //event.long_description.language_code = LongtArr[0].language_code;

      
        table.events.push(event);

        



    });


    return(table)



}

module.exports = createEIT;