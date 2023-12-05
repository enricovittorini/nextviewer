'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
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

const nopreview = 'data:image/jpeg;base64,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'


export default function Home() {
  const [probeConfig, setProbeConfig] = useState({});
  const [allTables, setAllTables] = useState({});
  const [listening, setListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('primary');
  const [previewImage, setPreviewImage] = useState(nopreview);
  const [previewPidDescription, setPreviewPidDescription] = useState('');




  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, [])

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('/nextviewer/events');
      
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
        <div className='col-md-6 col-lg-4'>
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
        <div className='col-md-6 col-lg-5'>
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

        <div className='col-md-12 col-lg-3'>
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
