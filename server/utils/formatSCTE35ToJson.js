function formatSCTE35ToJson(obj, scteIndex) {
    const { ["#name"]: Name, ["#nodes"]: Nodes, ...propObj } = obj;

    if (!Name) return {}; // Return an empty object if conditions are not met

    let newObj = {
        [Name]: { ...propObj }
    };

    if (Nodes && Nodes.length > 0) {
        Nodes.forEach(k => {
            const name = k["#name"];
            const formattedValue = formatSCTE35ToJson(k,scteIndex);

            if (name === "metadata") {
                k.id = scteIndex;
                newObj["metadata"] = { ...k };
                

            } else if (name.includes("descriptor")) {
                newObj[Name]["descriptors"] = (newObj[Name]["descriptors"] || []).concat(formattedValue);
            } else {
                switch (name) {
                    case "splice_insert":
                    case "splice_null":
                    case "splice_schedule":
                    case "bandwidth_reservation":
                    case "private_command":
                    case "time_signal":
                        newObj[Name]["command"] = formattedValue;
                        newObj["metadata"]["command_type"] = name;
                        break;
                    default:
                        newObj[Name] = { ...newObj[Name], ...formattedValue };
                        break;
                }
            }
        });
    }

    return newObj;
}

module.exports = formatSCTE35ToJson;
