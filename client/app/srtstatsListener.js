'use client'
import { useState, useEffect } from 'react';

function SrtStatsListener({ data, info }) {
  const [srtStats, setSrtStats] = useState(data);
  const version = info.srtversion;


  useEffect(() => {
    // Update the srtStats whenever data changes
    setSrtStats(data);
  }, [data]);

  return (
    srtStats.global && (
      <>
        <div>
          <h6 data-bs-toggle="collapse" href="#srtrcvglobal" role="button" aria-expanded="false" aria-controls="srtrcvglobal" style={{ color: 'deepskyblue' }}>SRT Global Stats</h6>
          <div className="collapse" id="srtrcvglobal">
            <table className="table table-sm" >
              <tbody className="table-group-divider" >
                <tr>
                  <td>SRT version</td>
                  {/* SRT lib version */}
                  <td className="text-end">{version}</td>
                </tr>
                <tr>
                  <td>RTT (ms)</td>
                  {/* Smoothed round-trip time */}
                  <td className="text-end">{srtStats.global.instant['rtt-ms']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h6 data-bs-toggle="collapse" href="#srtrcvtotal" role="button" aria-expanded="false" aria-controls="srtrcvtotal" style={{ color: 'deepskyblue' }}>SRT Total Stats</h6>
          <div className="collapse" id="srtrcvtotal">
            <table className="table table-sm">
              <tbody className="table-group-divider">
                <tr>
                  <td>Elapsed (ms)</td>
                  {/*The time elapsed, in milliseconds, since the SRT socket has been created */}
                  <td className="text-end">{srtStats.receive.total['elapsed-ms']}</td>
                </tr>
                <tr>
                  <td>Received Bytes</td>
                  {/*The total number of received DATA bytes, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.total['bytes']}</td>
                </tr>
                <tr>
                  <td>Received Packets</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.total['packets']}</td>
                </tr>
                <tr>
                  <td>Received Unique Pkts</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.total['unique-packets']}</td>
                </tr>
                <tr>
                  <td>Received Unique Bytes</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.total['unique-bytes']}</td>
                </tr>
                <tr>
                  <td>Dropped Pkts</td>
                  <td className="text-end">{srtStats.receive.total['dropped-packets']}</td>
                </tr>
                <tr>
                  <td>Lost Pkts</td>
                  <td className="text-end">{srtStats.receive.total['lost-packets']}</td>
                </tr>
                <tr>
                  <td>Dropped Bytes</td>
                  <td className="text-end">{srtStats.receive.total['drop-bytes']}</td>
                </tr>
                <tr>
                  <td>Lost Bytes</td>
                  <td className="text-end">{srtStats.receive.total['loss-bytes']}</td>
                </tr>
                <tr>
                  <td>Sent Ack Pkts</td>
                  <td className="text-end">{srtStats.receive.total['sent-ack-packets']}</td>
                </tr>
                <tr>
                  <td>Sent Nack Pkts</td>
                  <td className="text-end">{srtStats.receive.total['sent-nak-packets']}</td>
                </tr>
                <tr>
                  <td>Undecrypted Pkts</td>
                  <td className="text-end">{srtStats.receive.total['undecrypted-packets']}</td>
                </tr>
                <tr>
                  <td>Undecrypted Bytes</td>
                  <td className="text-end">{srtStats.receive.total['undecrypted-bytes']}</td>
                </tr>
                <tr>
                  <td>Packet Filter Control Pkts</td>
                  <td className="text-end">{srtStats.receive.total['filter-extra-packets']}</td>
                </tr>
                <tr>
                  <td>Recovered Pkts</td>
                  <td className="text-end">{srtStats.receive.total['filter-recovered-packets']}</td>
                </tr>
                <tr>
                  <td>Not Recovered Pkts</td>
                  <td className="text-end">{srtStats.receive.total['filter-not-recovered-packets']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h6 data-bs-toggle="collapse" href="#srtrcvinterval" role="button" aria-expanded="false" aria-controls="srtrcvinterval" style={{ color: 'deepskyblue' }}>SRT Interval Stats</h6>
          <div className="collapse" id="srtrcvinterval">
            <table className="table table-sm">
              <tbody className="table-group-divider">
                <tr>
                  <td>Received Bandwidth (Mbps)</td>
                  <td className="text-end">{srtStats.receive.interval['rate-mbps']}</td>
                </tr>
                <tr>
                  <td>Bytes</td>
                  <td className="text-end">{srtStats.receive.interval['bytes']}</td>
                </tr>
                <tr>
                  <td>Received Packets</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.interval['packets']}</td>
                </tr>
                <tr>
                  <td>Retrasmitted Packets</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.interval['retransmitted-packets']}</td>
                </tr>
                <tr>
                  <td>Received Unique Pkts</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.interval['unique-packets'] || "na"}</td>
                </tr>
                <tr>
                  <td>Received Unique Bytes</td>
                  {/*The total number of received DATA packets, including retransmitted packets  */}
                  <td className="text-end">{srtStats.receive.interval['unique-bytes']}</td>
                </tr>
                <tr>
                  <td>Dropped Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['dropped-packets']}</td>
                </tr>
                <tr>
                  <td>Dropped Bytes</td>
                  <td className="text-end">{srtStats.receive.interval['drop-bytes']}</td>
                </tr>
                <tr>
                  <td>Lost Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['lost-packets']}</td>
                </tr>
                <tr>
                  <td>Lost Bytes</td>
                  <td className="text-end">{srtStats.receive.interval['loss-bytes']}</td>
                </tr>
                <tr>
                  <td>Sent Ack Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['sent-ack-packets']}</td>
                </tr>
                <tr>
                  <td>Sent Nack Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['sent-nak-packets']}</td>
                </tr>
                <tr>
                  <td>Undecrypted Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['undecrypted-packets']}</td>
                </tr>
                <tr>
                  <td>Undecrypted Bytes</td>
                  <td className="text-end">{srtStats.receive.interval['undecrypted-bytes']}</td>
                </tr>
                <tr>
                  <td>Too Late Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['ignored-late-packets']}</td>
                </tr>
                <tr>
                  <td>Reorder Distance Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['reorder-distance-packets']}</td>
                </tr>
                <tr>
                  <td>Packet Filter Control Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['filter-extra-packets']}</td>
                </tr>
                <tr>
                  <td>Recovered Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['filter-recovered-packets']}</td>
                </tr>
                <tr>
                  <td>Not Recovered Pkts</td>
                  <td className="text-end">{srtStats.receive.interval['filter-not-recovered-packets']}</td>
                </tr>
              </tbody>
            </table >
          </div>
          <div>
            <h6 data-bs-toggle="collapse" href="#srtrcvinstant" role="button" aria-expanded="false" aria-controls="srtrcvinstant" style={{ color: 'deepskyblue' }}>SRT Instantaneous Stats</h6>
            <div className="collapse" id="srtrcvinstant">
              <table className="table table-sm" >
                <tbody className="table-group-divider" >
                  <tr>
                    <td>RTT (ms)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.global.instant['rtt-ms']}</td>
                  </tr>
                  <tr>
                    <td>Delivery delay (ms)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['delivery-delay-ms']}</td>
                  </tr>
                  <tr>
                    <td>Avail Buffer (byte)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['buffer-avail-bytes']}</td>
                  </tr>
                  <tr>
                    <td>Pkts in buffer (ack only pkts)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['buffer-ack-packets']}</td>
                  </tr>
                  <tr>
                    <td>Bytes in buffer (ack only bytes)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['buffer-ack-bytes']}</td>
                  </tr>
                  <tr>
                    <td>ms in buffer (ack only pkts)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['buffer-ack-ms']}</td>
                  </tr>
                  <tr>
                    <td>Avg Belated Time (ms)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['avg-belated-ms']}</td>
                  </tr>
                  <tr>
                    <td>MSS (byte)</td>
                    {/* Smoothed round-trip time */}
                    <td className="text-end">{srtStats.receive.instant['mss-bytes']}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default SrtStatsListener;
