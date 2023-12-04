
'use client'
import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';


function Properties({ data }) {
    let serviceId = data.service_id;
    let node = data;

    return (Object.keys(node).map(k => {
        return k !== "#nodes" && k !== "#name" && node[k] !== "component" ? (
            <li key={"cat_table_prop_" + serviceId + "_" + k} className='prop'>{k}: {node[k].toString()}</li>) : null
    })

    )
};


function renderTable(data) {
    if (!data) {
        return null;
    }

    return (

        <details>
            <summary>{data["#name"]}</summary>
            <ul>
                {/* cat properties */}
                <Properties data={data} />
            </ul>
        </details>

    )

};


function Cat({ data }) {


    var [catTable, setTable] = useState(data.cat);


    useEffect(() => {
        setTable(data.cat); // Update nitTable when allTables changes
    }, [data.cat]);


    if (catTable && Object.keys(catTable).length > 0) {
        //let bitrate = Intl.NumberFormat('en-US', { style: 'unit', unit: "kilobit-per-second", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(catTable["#nodes"][0]["bitrate"])
        const bitrate = convertBitrate(catTable["#nodes"][0]["bitrate"]);
        return (!!catTable["#name"] ?

            <ul className="tree">
                <li key="cat">
                    <details>
                        <summary>{catTable["#name"]} - {bitrate}</summary>
                        <ul>
                            {catTable["#nodes"].map((k, i) => (
                                <li key={i}>
                                    {i !== 0 ? renderTable(k) : null}
                                </li>
                            ))}
                            <Properties data={catTable} />
                        </ul>
                    </details>
                </li>
            </ul>




            : null)
    } else {
        /*  return (
  
              <ul className="tree">
                  <li>
                      <details>
                          <summary>CAT - 0 kb/s</summary>
                      </details>
                  </li>
  
              </ul>
          )*/
    };
}






export default Cat;
