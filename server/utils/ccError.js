function ccError(pids) {
    let cc = 0;

    if (Array.isArray(pids)) {
        pids.forEach(k => {
            if (k && k.packets && typeof k.packets.discontinuities === 'number') {
                cc += k.packets.discontinuities;
            }
        });
    }

    return cc;
}

module.exports = ccError;
