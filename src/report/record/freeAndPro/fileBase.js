class FileBase {

    startCollectLogs() {
        throw new Error("Method 'startCollectLogs()' must be implemented.");
    }

    stopCollectLogs() {
        throw new Error("Method 'stopCollectLogs()' must be implemented.");
    }
}

export default FileBase;
