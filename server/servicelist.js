//Generate the following JSON to build the service list:

/*
[
    {
        "service_name": "BBC",
        "service_id": 1,
        "scrambled": true,
        "service_type": "Digital TV",
        "service_icon": "icon string",
        "service_pcr_pid": 100,
        "service_pmt_pid": 101,
        "service_provider": "Sky",
        "components": [
            {
                "id": 100,
                "icon_scrambled": null,
                "bitrate": 0,
                "icon": pid_icon,
                "icon_scrambled": null,
                "description": "",
                "descriptionDetails": ""
            }
        ]
    },
    {}
]
*/

const convertBitrate = require('./convertBitrate')
const getPidType = require('./getPidType');
const { getServiceType, getServiceTypeHuman } = require('./getServiceType');


function getServiceProp(service, el) {


    //el.bitrate = service?.bitrate ? convertBitrate(service.bitrate) : convertBitrate(0);
    el.service_pcr_pid = service["pcr-pid"] || null;
    el.service_pmt_pid = service["pmt-pid"] || null;
    el.scrambled = service["is-scrambled"];


    return service.pids;

}

function getServiceAnalyzeProp(service, el) {

    // When there is not SDT, i need to get the info from the Analyze plugin
    /* from the analyze.service get:
    - service_id
    - service icon
    - service name
    - provider
    - service type
    - service scrambled
    */

    el.service_id = service?.id;
    el.service_name = service?.name;
    el.service_provider = service?.provider;
    el.service_type = service?.type;
    el.service_icon = el.service_type && getServiceType(el.service_type);
    el.service_description = el.service_type && getServiceTypeHuman(el.service_type);
    el.scrambled_icon = service["is-scrambled"] ? "bi bi-key" : null;

    return service.pids;
}



function getServiceSDTprop(sdt, sid, el) {
    /* from the SDT get:
    - service_id
    - service name
    - provider
    - service type
    */

    const serviceId = sdt['#nodes'].find(node => node['#name'] === 'service' && node.service_id === sid);
    const service = serviceId ? serviceId['#nodes'].find(node => node['#name'] === 'service_descriptor') : null;
    el.service_id = sid;
    el.service_name = service?.service_name;
    el.service_provider = service?.service_provider_name;
    el.service_type = service?.service_type;
    el.service_icon = service?.service_type && getServiceType(service.service_type);
    el.service_description = service?.service_type && getServiceTypeHuman(service.service_type);

}

function getPidProperties(pids, x, elcomp, el) {


    const component = {}
    const pid = pids.find(k => k.id === x);
    el.bitrate = el.bitrate + pid.bitrate;


    // Do not include PMT, ECM and  EMM in the component list
    if (!pid?.pmt && !pid?.ecm && !pid?.emm) {
        let [icon, scrambledIcon, description, descriptionDetails] = getPidType(pid);

        component.id = x;
        component.pcr = pid?.["packets"]?.pcr > 0 ? true : false;
        component.is_scrambled = pid?.["is-scrambled"];
        component.bitrate = convertBitrate(pid?.["bitrate"]);
        component.video = pid?.["video"];
        component.icon = icon;
        component.icon_scrambled = scrambledIcon;
        component.description = description;
        component.descriptionDetails = descriptionDetails;

        elcomp.push(component)
    }


}

function getServicelist(sdt, jAnalyze) {

    const list = [];
    let services = [];

    if (Object.keys(sdt).length > 0){
        const sdtServices = sdt["#nodes"].filter(k => k["#name"] === "service" && k.service_id).map(k=> k.service_id);
        services = jAnalyze.services.filter(item => sdtServices.includes(item.id));

    } else {
        services = jAnalyze?.services?.filter(k => k.bitrate !== 0);
    }
    
    const pids = jAnalyze?.pids;
    //const services = jAnalyze?.services?.filter(k => k.bitrate !== 0);



    // Keep only the services listed in the SDT as i use "-c" option in the SLOWANA
    //const sdtServices = sdt["#nodes"].filter(k => k["#name"] === "service" && k.service_id).map(k=> k.service_id);
    //const services = jAnalyze.services.filter(item => sdtServices.includes(item.id));
    
    

    services && services.map(k => {
        const el = {};

        el.components = [];
        //el.bitrate = allTables.analyze.services?.find(j => k.id === j.id).bitrate || 0;
        el.scrambled_icon = k["is-scrambled"] ? "bi bi-lock" : null;
        el.lcn = k.lcn || null;

        // check that SDT tables has elements
        if (Object.keys(sdt).length > 0) {

            getServiceSDTprop(sdt, k.id, el);

        } else {

            getServiceAnalyzeProp(k, el)
        }

        //Now get the info on the components:
        const servicePids = getServiceProp(k, el);
        servicePids && servicePids.forEach(x => {

            getPidProperties(pids, x, el.components, el);

        })

        //el.bitrate = convertBitrate(k.bitrate)

        list.push(el);

    })

    return (list)




}

module.exports = getServicelist;