import * as store from "../store.js";
import DOMPurify from 'dompurify';
import JSZip from 'jszip';

function getTitle() {
    let title = '';
    store.titleInStore.subscribe(value => {
        title = value;
    })();
    return title;
}

export function getUpgradeMessage() {
    return "This content is available in the PRO version.\n";
}


export function downloadFilesInZip(filesContent, zipFileName) {
    const zip = new JSZip();
    
    filesContent.forEach(file => {
        const { content, fileType } = file;
        const fileName = `${generatePrefix()}_${fileType}_${generateSuffix()}`; 

        if (fileType === 'video') {
            zip.file(`${fileName}.mp4`, content, { binary: true });
        } else if (fileType === 'console_log') {
            zip.file(`${fileName}.html`, content);
        } else if (fileType === 'chat_messages') {
                zip.file(`${fileName}.html`,content);
        }
         else {
            zip.file(`${fileName}.txt`, content);
        }
    });

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            const zipFileURL = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.download = zipFileName;
            a.href = zipFileURL;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
}


export function downloadFile(content, filetype, isTextContent = false) {

    const prefix = generatePrefix();
    const suffix = generateSuffix();
    const fileName = `${prefix}_${filetype}_${suffix}`;
    let href;

    if (isTextContent) {
        const blob = new Blob([content], { type: "text/plain" });
        href = URL.createObjectURL(blob);
    } else {
        href = content;
    }

    const a = document.createElement("a");
    a.download = fileName;
    a.href = href;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (isTextContent) {
        URL.revokeObjectURL(href);
    }
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${day}_${month}_${year}`;
}

export function generatePrefix() {
    return sanitize(getSanitizedSubTitle());
}

export function generateSuffix() {
    return getCurrentDate();
}

export function getSanitizedSubTitle() {
    let subTitle = getTitle().substring(0, 12);
    return sanitize(subTitle);
}

export function getSanitizedTitle() {
    return sanitize(getTitle());
}

export function sanitize(text) {
    return DOMPurify.sanitize(text);
}

export function returnEmailByClass(emailClass) {
    const messages = store.getMessages();
    for (let i = 0; i < messages.length; i++) {
        if (i + 1 < messages.length && messages[i].class === emailClass) 
            return messages[i + 1].text;

    }
    console.log(`Class "${emailClass}" not found in messages.`);
    return null;
}

function getCurrentDateForDebug() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = months[now.getUTCMonth()];
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    return '[' + day + '-' + month + '-' + year + ' ' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + ' UTC]';
  }
export function getCustomMessage(word,num) {
    const template = getCurrentDateForDebug()+`PHP ${word}:  ---------------------------------\n`;
    return template.repeat(num);
}
export function getEnvDetailsMessage() {
    return "\nScreen size:--------\nBrowser type:--------";
}
export function getConsoleMessage() {
    return `<br>This file provides a detailed output for the following console methods:<br>console.log<br>console.error<br>console.warn<br>console.debug`;
}
export function createConsoleLogsHtml(){
    let logsHtml = '';

    if (store.isFreeVersion() === true) {
        logsHtml = getUpgradeMessage() + getConsoleMessage();
    } else {
        logsHtml = (console.logs && console.logs.length > 0) ? console.logs.join('\n') : 'No logs collection - no recording available!';
    }
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Console</title>
        <style>
        body {
            font-family: Consolas, "Courier New", monospace;
            background-color: #ffffff;
            color: #000;
            padding: 10px;
        }
        .log {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid #e1e1e1;
            word-break: break-word;
            font-size: 14px;
        }
        .log i {
            margin-right: 10px;
        }
        .log .content {
            flex: 1;
        }
        .info .content {
            background-color: transparent;
            border-radius: 4px;
        }
        .warn .content {
            background-color: #fff8e1;
            border-radius: 4px;
        }
        .error .content {
            background-color: #ffebee;
            border-radius: 4px;
        }
        .debug .content {
            background-color: #f3e5f5;
            border-radius: 4px;
        }
        .object-viewer {
            cursor: pointer;
            color: #0066cc;
            text-decoration: underline;
        }
        .object-details {
            display: none;
            margin-left: 20px;
            font-family: Consolas, "Courier New", monospace;
        }
   
    </style>
    
    </head>
    <body>
    <h1>Console</h1>
    <div>${logsHtml}</div>
    <script>
   
     let messege = "";
        function toggleObjectDetails(event) {
        const target = event.currentTarget;
        const details = target.nextElementSibling;
        if (details) {
            if (details.style.display === 'none') {
                details.style.display = 'block';
                messege = target.innerText;
                target.innerHTML = '<i class="fas fa-angle-up"></i> Hide details';
            } else {
                details.style.display = 'none';
               target.innerHTML = '<i class="fas fa-angle-down"></i> ' + messege;

            }
        }
    };
    
    </script>
    </body>
    </html>`;
    return new Blob([htmlContent], { type: "text/html" });
}