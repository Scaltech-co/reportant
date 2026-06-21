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
