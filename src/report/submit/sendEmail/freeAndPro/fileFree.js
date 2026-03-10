import FileBase from './fileBase.js';
import { getUpgradeMessage, getCustomMessage, getConsoleMessage, getEnvDetailsMessage } from "../../FileFunctions.js";
import { createConsoleLogsHtml} from "../../FileFunctions.js";

class FileFree extends FileBase {
    createEnviromentDetailsFile() {
        return getUpgradeMessage() + getEnvDetailsMessage();
    }

    createConsoleLogFiles() {
        return createConsoleLogsHtml();
    }

    createConsoleLogMessage() {
        return getUpgradeMessage() + getConsoleMessage();
    }

    createErrorLogMessage() {
        return getUpgradeMessage()+ getCustomMessage("Warning",3);
    }

    createDebugLogMessage() {
        return getUpgradeMessage()+ getCustomMessage("Notice",2) + getCustomMessage("Warning",2);
    }
}

export default FileFree;
