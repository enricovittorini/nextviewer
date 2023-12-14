function ccError(pids) {
    let cc = 0;

    if (Array.isArray(pids)) {
        cc = pids.reduce((totalDiscontinuities, k) => {
            if (k?.packets?.discontinuities !== undefined && typeof k.packets.discontinuities === 'number') {
                return totalDiscontinuities + k.packets.discontinuities;
            }
            return totalDiscontinuities;
        }, cc);
    }

    return cc;
}

module.exports = ccError;
