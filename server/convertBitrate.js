


function convertBitrate(bitrate) {
    let formattedBitrate;
  
    if (bitrate >= 1e6) {
      // If the bitrate is 1 million bits per second or more, convert to Mbps
      formattedBitrate = new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'megabit-per-second',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(bitrate / 1e6);
    } else {
      // If the bitrate is less than 1 million bits per second, convert to Kbps
      formattedBitrate = new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'kilobit-per-second',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(bitrate / 1e3);
    }
  
    return formattedBitrate;
  }

  module.exports = convertBitrate