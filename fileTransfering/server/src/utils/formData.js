const getBoundary = (headers) => {
    const contentType = headers["content-type"];
    const boundaries = contentType
        .split("; ")
        .filter((value) => value.startsWith("boundary"))
        .map((value) => "--" + value.split("boundary=").join(""));

    if (boundaries.length < 1) {
        throw new Error("Boundary is not defined");
    }

    return boundaries[0];
};

const getFileInfo = (metaData) => {
    const metaDataLines = metaData.split("\r\n");
    const fileName = metaDataLines[1]
        .split("; ")
        .filter((value) => value.startsWith("filename="))
        .map((value) => value.slice("filename=".length + 1, value.length - 1))[0];

    const mediaType = metaDataLines[2].split(" ")[1];

    return { fileName, mediaType };
};

module.exports = { getBoundary, getFileInfo };
