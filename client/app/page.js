'use client';
import { useState, useEffect } from 'react';
import ProbeConfig from './probeconfig';
import SpinnerConnection from './spinnerConnection';
import convertBitrate from './utils/convertBitrate';


import Pat from './pat';
import Cat from './cat';
import Pmt from './pmt';
import Nit from './nit'
import Sdt from './sdt';
import SdtOther from './sdtOther';
import Bat from './bat';
import PidsList from './pids';
import SrtStats from './srtstats';
import Footer from './footer';
import Credits from './credits';
import ServiceList from './servicelist';
import CcBadge from './badge';
import SrtStatsListener from './srtstatsListener';
import Preview from './preview';

//import Image from 'next/image';
//import styles from './page.module.css';

const nopreview = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAPTGF2YzYwLjMuMTAwAP/bAEMACDIyOzI7REREREREUUtRVFRUUVFRUVRUVFpaWmpqalpaWlRUWlpkZGpqc3ZzbW1qbXZ2fX19lpaPj6+vtdfX///EAHQAAQADAQEBAQEAAAAAAAAAAAAGBwQFAQMCCAEBAAAAAAAAAAAAAAAAAAAAABABAAICAAQDBQYEBwEAAAAAAAECAxESBCExQVFhInGREzKhwbHR8RRSI4FzM0I0koLwckMRAQAAAAAAAAAAAAAAAAAAAAD/wAARCAC0AUADASIAAhEAAxEA/9oADAMBAAIRAxEAPwD+fwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtrS1t8NZnXfUTOmIAa+G2uLU67b10+LIAAAOnXHe/wBNbW90TP4NXycsf/O/+2fyBwh68AAAAAGqa2rrcTG+sbjW49GUAAAAAAAAAAAAAAAAAAAAAAAAF08hbgjNb+Gu/htG+axRSYvT6L9Y9J8nS5T/AA+Y/tz+EveVvGSs4L9rfTPlYHk/6Kv9z80TxcvfLEzGorH+a06hPMtJx8rw27xk/Ni5n2cHL1jtNdz6z0/MEVyctkxRxdLV/irO4Q9bXJ9YzVn6ZpMz71SgubBaacrltWdTFo6/BDo5vPE/XKcctaKctltNYtq0dJ7T2cT95Eda4cUT56/QHU5vHx5MWoitskRuPWfNGbcpkpFpmaRrfTfWYjxiNM1MlsvMY7Wnc8dfxe83O89/fr7AfLHy2TJXi9mtfO06hiy4L4dcWtT2mOsSuLma4Z4K2yzSK1jVeGZj39Eam2CuC+OMvHud19m0an4Ar3JhtiikzMTF43Ex+kPK4bWx2ybiK16dfGfTomlf5vKzHjincf8Amf8AsvOY/lYcWLxn27e+ewOBnjJFcXHaJiaRw68I6dJ6R97RTlMlqxaZrSJ7cU62leaIn9pE9prWJ+x1+arhvlnjzTWYiI4eCZ10BUd8N8dorbpvtPh79vhlxWw3mltbjy7dU/zXxfIrSuTjmtunszHTy6w781+fblr+cat/w6/b1BV+bBfBri11jfT9IZL4rY60tOvbjcR469ei18s/usUTHeuWa/0tPT7kM5y0Tl4Y7UiKx/QFegAAAAAAAAAAAAAAAAAAAm2DNXHXLE79uuo17p79UMjo/AC18/Nxmw1rMTxbiZnprpv1+5zMeek44x5azasfTMfVCuwFk2z0pSaYazXi+q1u8x5K2AE5pmrXBkxzE7tMTHl4eqDADq47RS9LT2raJ+EtWa8ZMlrRvUz4uAAsyM+PJStc1bTw9ItXvrynbLkz0+X8vFWa1mdzM95V6AmHL5ow33aN1mJi0ejDnyfOyWv59vd4I6Am2bNGSuKI3E0rETvz6durvTnw5tTmpbiiNcVNdfftVYCc5s9b1rSleGlfjM+rr4OajFitSYmZ68M9OkzGvNV4CyeV5iuDi4omYnXbXePfKvrTNpmZ7zO/izgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z'


export default function Home() {
  const [probeConfig, setProbeConfig] = useState({});
  const [allTables, setAllTables] = useState({});
  const [listening, setListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('primary');
  const [previewImage, setPreviewImage] = useState(nopreview);
  const [previewPidDescription, setPreviewPidDescription] = useState('');

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('/events');
      // onerror version

      events.onerror = (e) => {
        console.log("An error occurred while attempting to connect.");
        setConnectionStatus('danger');
      };

      // onopen version
      events.onopen = (e) => {
        console.log("The connection has been established.");
        setConnectionStatus('success');
      };


      events.addEventListener('allTables', (event) => {
        const parsedData = JSON.parse(event.data);
        setAllTables(parsedData)
      })


      events.addEventListener('config', (event) => {
        const parsedData = JSON.parse(event.data);
        setProbeConfig((parsedData))
      })


      events.addEventListener('previewImage', (event) => {
        const data = JSON.parse(event.data);
        setPreviewImage(data);
      })

      events.addEventListener('description', (event) => {
        const data = event.data;
        //console.log(data)
        setPreviewPidDescription(data.toString());
      })

      setListening(true);
    }


  }, [allTables, probeConfig, previewImage]);

  let tsbitrate = 0;
  let netbitrate = 0;
  let nullbittrate = 0;

  if (allTables && allTables.bitrate && allTables.bitrate.tsbitrate) {
    //tsbitrate = convertBitrate(allTables.bitrate.tsbitrate.replaceAll(',', ''));
    tsbitrate = convertBitrate(allTables.bitrate.tsbitrate.replace(/,/g, ''));
    //netbitrate = convertBitrate(allTables.bitrate.netbitrate.replaceAll(',', ''));
    netbitrate = convertBitrate(allTables.bitrate.netbitrate.replace(/,/g, ''));
    //nullbittrate = convertBitrate((allTables.bitrate.tsbitrate.replaceAll(',', '') - allTables.bitrate.netbitrate.replaceAll(',', '')));
    nullbittrate = convertBitrate((allTables.bitrate.tsbitrate.replace(/,/g, '') - allTables.bitrate.netbitrate.replace(/,/g, '')));

  }

  var clearServices = allTables?.analyze?.services?.filter(k => k["is-scrambled"] === false);

  return (


    <>
      <SpinnerConnection data={connectionStatus} />
      <div className='row'>
        <ProbeConfig data={probeConfig} />
      </div>

      <div className='row'>
        <div className='col-2 d-flex align-items-center'><h6 style={{ color: 'deepskyblue' }}>TS: {tsbitrate}</h6></div>
        <div className='col-2'><h6 style={{ color: 'deepskyblue' }}>Net: {netbitrate}</h6></div>
        <div className='col-3'><h6 style={{ color: 'deepskyblue' }}>Null: {nullbittrate}</h6></div>
        <CcBadge data={allTables} />
        <hr />
      </div>

      <div className='row'>
        <div className='col-md-4'>
          <div className='row'>
            <h6>PSI-SI</h6>
            <Pat data={allTables} />
            <Cat data={allTables} />
            <Pmt data={allTables} />
            <Nit data={allTables} />
            <Sdt data={allTables} />
            <SdtOther data={allTables} />
            <Bat data={allTables} />
          </div>
        </div>
        <div className='col-md-5'>
          <div className='row'>
            <h6>Service List</h6>
            <ServiceList data={allTables} />
          </div>
          <hr />
          <div className='row'>
            <h6>PIDs</h6>
            <PidsList data={allTables} />
          </div>
        </div>

        <div className='col-md-3'>
          <div className='row'>
            <Preview services={clearServices} previewId={probeConfig.previewSid} image={previewImage} pids={allTables.pids} desc={previewPidDescription} />
          </div>
          <hr />
          <div className='row'>
            {allTables.srt && Object.keys(allTables.srt).length > 0 && probeConfig.type === "caller" ? <SrtStats data={allTables.srt} info={allTables.info} /> : null}
            {allTables.srt && Object.keys(allTables.srt).length > 0 && probeConfig.type === "listener" ? <SrtStatsListener data={allTables.srt} info={allTables.info} /> : null}
          </div>
        </div>

        <Footer />
        <Credits />
      </div>
    </>

  )
}
