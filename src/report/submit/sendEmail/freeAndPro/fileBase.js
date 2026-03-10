class FileBase {
    createEnviromentDetailsFile() {
        throw new Error("Method 'createEnviromentDetailsFile()' must be implemented.");
    }

    createConsoleLogFiles() {
        throw new Error("Method 'createConsoleLogFiles()' must be implemented.");
    }

    createConsoleLogMessage() {
        throw new Error("Method 'createConsoleLogMessage()' must be implemented.");
    }

    createErrorLogMessage() {
        throw new Error("Method 'createErrorLogMessage()' must be implemented.");
    }

    createDebugLogMessage() {
        throw new Error("Method 'createDebugLogMessage()' must be implemented.");
    }
}

export default FileBase;
