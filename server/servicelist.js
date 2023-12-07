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
const {getServiceType, getServiceTypeHuman} = require('./getServiceType');

function getServiceProp(services, sid, el) {
    const service = services.find(k => k.id === sid);
    el.bitrate = convertBitrate(service?.bitrate);
    el.service_pcr_pid = service["pcr-pid"] || null;
    el.service_pmt_pid = service["pmt-pid"] | null;
    el.scrabled = service["is-scrambled"];
    

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
    el.scrambled_icon = service["ca_mode"] ? "bi bi-key" : null;
}

function getPidProperties(pids, x, elcomp) {


    const component = {}
    const pid = pids.find(k => k.id === x);

    // Do not include PMT, ECM and  EMM in the component list
    if (!pid.pmt && !pid.ecm && !pid.emm) {
        let [icon, scrambledIcon, description, descriptionDetails] = getPidType(pid);
        component.id = x;
        component.is_scrambled = pid["is-scrambled"];
        component.bitrate = convertBitrate(pid["bitrate"]);
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

    // check that SDT tables has elements if not exit
    if (Object.keys(sdt).length > 0) {

        const list = [];
        const pids = analyze?.pids;
        const services = analyze?.services;

        services.map(k => {
            const el = {};
            el.components = [];
            getServiceSDTprop(sdt, k.id, el);
            const servicePids = getServiceProp(services, k.id, el);

            //Now get the info on the components:
            servicePids.forEach(x => {

                getPidProperties(pids, x, el.components);

            })

           // console.log(el)
           list.push(el);

        })
        console.log(list)
        return(list)


    }

}

module.exports = getServicelist;