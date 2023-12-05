'use client'
import { useState, useEffect } from 'react';


function ProbeIp({ config }) {

    const [address, setAddress] = useState(config.address ? config.address : '');
    const [port, setPort] = useState(config.port ? config.port : '');

    return (
        <>
            <div className='col-md-3'>
                <label htmlFor="inputState" className="form-label">Address</label>
                <input type="text" className="form-control form-control-sm" name="address" value={address} onChange={e => setAddress(e.target.value)}></input>
            </div>
            <div className='col-md-2'>
                <label htmlFor="inputState" className="form-label" >Port</label>
                <input type="text" className="form-control form-control-sm" name="port" value={port} onChange={e => setPort(e.target.value)}></input>
            </div>
        </>
    )
}


function ProbeSrt({ config, probeType }) {

    const [address, setAddress] = useState(config.address ? config.address : '');
    const [port, setPort] = useState(config.port ? config.port : '');
    const [latency, setLatency] = useState(config.latency ? config.latency : "100");
    const [encryption, setEncryption] = useState(config.encryption ? config.encryption : '');
    const [passphrase, setPassphrase] = useState(config.passphrase ? config.passphrase : '');

    /*const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        //setConfig({ ...config, type: selectedType });
        setSelected(selectedType);
    };*/

    return (
        <>
            <div className='col-md-6'>
                <label htmlFor="inputState" className="form-label">Remote Address</label>
                <input type="text" className="form-control form-control-sm" name="address" value={address} onChange={e => setAddress(e.target.value)} placeholder='remote_host:port'></input>
            </div>

            <div className='col-md-2'>
                <label htmlFor="inputState" className="form-label">LocalPort</label>
                <input type="text" className="form-control form-control-sm" name="port" value={port} onChange={e => setPort(e.target.value)} disabled={probeType === 'caller'}></input>
            </div>

            <div className='col-md-3'>
                <label htmlFor="inputState" className="form-label">Latency (ms)</label>
                <input type="text" className="form-control form-control-sm" name="latency" value={latency} onChange={e => setLatency(e.target.value)}></input>
            </div>

            <div className='col-md-3'>
                <label htmlFor="type" className="form-label">Encryption</label>
                <select className="form-select form-select-sm" name="encryption" value={encryption} onChange={e => setEncryption(e.target.value)}>
                    <option key="noenc" value="0">None</option>
                    <option key="aes128" value="16">AES-128</option>
                    <option key="aes192" value="24">AES-192</option>
                    <option key="aes256" value="32">AES-256</option>
                </select>
            </div>

            <div className='col-md-3'>
                <label htmlFor="inputState" className="form-label">Passphrase</label>
                <input type="password" className="form-control form-control-sm" name="passphrase" value={passphrase} onChange={e => setPassphrase(e.target.value)}></input>
            </div>
        </>
    )
}



function ProbeConfig({ data }) {

    const [config, setConfig] = useState({});
    const [probeType, setProbeType] = useState('');
    //const [probeStatus, setProbeStatus] = useState('');
    const [probeInterface, setInterface] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [buttonState, setButtonState] = useState({ startBtn: '', stopBtn: 'disabled' });


    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;

        const formData = new FormData(form); // Create FormData object from the submitted form
        const formJson = Object.fromEntries(formData.entries());
        formJson.interfaceList = config.interfaceList;

        try {
            const response = await fetch(`/nextviewer/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formJson),
            });
            if (response.ok) {
                setConfig(formJson)
                handleStart();

            } else {
                // Handle errors
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error while calling API to start probe:', error);
        }

    }

    async function handleStop() {

        try {
            const response = await fetch(`/nextviewer/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


            });
            if (response.ok) {
                setFormStatus('')
                setButtonState({ startBtn: '', stopBtn: 'disabled' });

            } else {
                // Handle errors
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error while stopping probe:', error);
        }



    }

    async function handleStart() {

        try {
            const response = await fetch(`/nextviewer/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }

            });
            if (response.ok) {
                //console.log("Starting ok")
                setFormStatus('disabled')
                setButtonState({ startBtn: 'disabled', stopBtn: '' });

            } else {
                // Handle errors
                console.log("Failed to start  probe")
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error while starting probe:', error);


        }



    }





    //Fetch the server to get the probe config only when "data" change.
    useEffect(() => {


        setConfig(data);
        setProbeType(data.type === null ? "ip" : data.type);
        setInterface(data.interface === null ? data.interfaceList[0] : data.interface);
        //console.log(data.status)
        switch (data.status) {

            case "running":
                setButtonState({ startBtn: 'disabled', stopBtn: '' });
                setFormStatus('disabled')
                break;
            case "stopped":
                setButtonState({ startBtn: '', stopBtn: 'disabled' });
                setFormStatus('')
                break;
            default:
                break;
        }


    }, [data]);


    return (
        <>

            <div className='row g-3 mb-5'>
                <div className="col-12 col-md-12 col-lg-11">
                    <form onSubmit={handleSubmit}>
                        <fieldset className="row g-3" disabled={formStatus === 'disabled'}>
                            <div className='col-12 col-md-12 col-lg-4'>
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="type" className="form-label">Type</label>
                                        <select className="form-select form-select-sm" name="type" value={probeType} onChange={e => setProbeType(e.target.value)}>
                                            <option value="ip">IP</option>
                                            <option value="caller">SRT Caller</option>
                                            <option value="listener">SRT Listener</option>
                                        </select>
                                    </div>

                                    <div className='col'>
                                        <label htmlFor="type" className="form-label" >Interface</label>
                                        <select className="form-select form-select-sm" name="interface" value={probeInterface} onChange={e => setInterface(e.target.value)}>
                                            {
                                                config.interfaceList && config.interfaceList.map((k, index) => (
                                                    <option key={index} value={k}>{k}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-12 col-lg-7'>
                                <div className='row'>
                                    {(probeType === "ip" || probeType === null) && <ProbeIp config={config} />}
                                    {(probeType === "caller") && <ProbeSrt config={config} probeType={"caller"} />}
                                    {(probeType === "listener") && <ProbeSrt config={config} probeType={"listener"} />}
                                </div>
                            </div>

                            <div className='col-md-12 col-lg-1 d-flex flex-column'>
                                <div className="mt-auto"></div>
                                <div className='row'>
                                    <div className='col d-flex flex-column'>
                                        <button className="btn btn-primary btn-sm" type="submit" value="submit" disabled={buttonState.startBtn === "disabled"}>Start</button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div className="col-12 col-,d-12 col-lg-1 d-flex flex-column">
                    <div className="mt-auto"></div>
                    <div className='row'>
                        <div className='cold-lg-6 col-md-12 col-sm-12 d-flex flex-column'>
                            <button className="btn btn-danger btn-sm" onClick={handleStop} type="submit" value="stop" disabled={buttonState.stopBtn === "disabled"}>Stop</button>
                        </div>
                    </div>
                </div>
            </div >

        </>

    )

}

export default ProbeConfig