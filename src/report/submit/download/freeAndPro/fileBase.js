class FileBase {

    download() {
        throw new Error("Method 'download()' must be implemented.");
    }
    
    downloadEnviromentDetailsFile() {
        throw new Error("Method 'downloadEnviromentDetailsFile()' must be implemented.");
    }

    downloadFiles() {
        throw new Error("Method 'downloadFiles()' must be implemented.");
    }
}

export default FileBase;
