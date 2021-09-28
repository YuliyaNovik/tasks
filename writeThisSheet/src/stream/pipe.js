const pipeAfter = (previous, next, destination) => {
    if (previous === null || previous.readableEnded) {
        next.pipe(destination, { end: false });
    } else {
        previous.once("end", () => {
            next.pipe(destination, { end: false });
        })
    }
}

const pipeEvery = (readableStreams, destination) => {
    if (readableStreams.length <= 0) {
        throw Error("Nothing to pipe");
    }

    readableStreams.reduce((previous, current) => {
        pipeAfter(previous, current, destination)
        return current;
    }, null);
}

module.exports = { pipeEvery }