const pipeAfter = (previous, next, destination) => {
    if (previous === null || previous.readableEnded) {
        next.pipe(destination, { end: false });
    } else {
        previous.once("end", () => {
            next.pipe(destination, { end: false });
        })
    }
}

module.exports = { pipeAfter }