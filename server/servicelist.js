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
    
    //const service = services.find(k => k.id === sid);
    el.bitrate = service?.bitrate ? convertBitrate(service.bitrate) : convertBitrate(0);
    el.service_pcr_pid = service["pcr-pid"] || null;
    el.service_pmt_pid = service["pmt-pid"] || null;
    el.scrabled = service["is-scrambled"];


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

function getPidProperties(pids, x, elcomp) {


    const component = {}
    const pid = pids.find(k => k.id === x);


    // Do not include PMT, ECM and  EMM in the component list
    if (!pid.pmt && !pid.ecm && !pid.emm) {
        let [icon, scrambledIcon, description, descriptionDetails] = getPidType(pid);
       
        component.id = x;
        component.pcr = pid["packets"]?.pcr > 0 ? true : false ;
        component.is_scrambled = pid["is-scrambled"];
        component.bitrate = pid["bitrate"]; // it is already converted when it arrives here
        component.video = pid["video"];
        component.icon = icon;
        component.icon_scrambled = scrambledIcon;
        component.description = description;
        component.descriptionDetails = descriptionDetails;
        //component.description = pid["description"];
        //component.description = pid["description"].substring(0, pid["description"].indexOf("(")).trim() || pid["description"];

        elcomp.push(component)
    }


}

function getServicelist(sdt, analyze) {

    const list = [];
    const pids = analyze?.pids;
    const services = analyze?.services?.filter(k => k.bitrate !== 0);

    // check that SDT tables has elements if not exit

    services && services.map(k => {

             
        const el = {};
        
        el.components = [];
        if (Object.keys(sdt).length > 0) {
            getServiceSDTprop(sdt, k.id, el);
            
            //const servicePids = getServiceProp(services, k.id, el);
        } else{

            getServiceAnalyzeProp(k, el)
            //const servicePids = getServiceProp(services, k.id, el);
        }

        //
        el.scrambled_icon = k["is-scrambled"] ? "bi bi-lock" : null;
        el.lcn = k.lcn || null;
        //Now get the info on the components:
        const servicePids = getServiceProp(k, el);
        servicePids && servicePids.forEach(x => {

            getPidProperties(pids, x, el.components);

        })

       

        list.push(el);

    })
    
    return (list)




}

module.exports = getServicelist;