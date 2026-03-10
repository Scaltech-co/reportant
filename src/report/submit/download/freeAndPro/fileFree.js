import FileBase from './fileBase.js';
import { get } from 'svelte/store';
import { videoUrlInStore, getMessages, titleInStore} from '../.././../store.js';
import {createConsoleLogsHtml, generatePrefix, generateSuffix, returnEmailByClass, downloadFilesInZip, getUpgradeMessage, getCustomMessage, getConsoleMessage, getEnvDetailsMessage, getSanitizedTitle } from "../../FileFunctions.js";
import DOMPurify from 'dompurify';

 const csrfToken = window.reportant_csrf_nonce;

class FileFree extends FileBase {


    async download() {
        const envDetailsBlob = getUpgradeMessage() + getEnvDetailsMessage();
        const consoleLogs = createConsoleLogsHtml();
        const debugLogMessageForFreeVersion = getUpgradeMessage() + getCustomMessage("Notice", 2) + getCustomMessage("Warning", 2);
        const errorLogMessageForFreeVersion = getUpgradeMessage() + getCustomMessage("Warning", 3);
        const chatInStore = getMessages();
        const prefix = generatePrefix(); 
        const suffix = generateSuffix();
        const sanitizedTitle = DOMPurify.sanitize(titleInStore.value || "")
        const emailResponseTo = returnEmailByClass("emailResponseTo");

        const videoUrl = get(videoUrlInStore);


        let videoContent = null;
        if (videoUrl) {    
            videoContent = await fetch(videoUrl).then(res => res.blob());
        }

        if (!csrfToken) {
            alert("CSRF token is missing. Please refresh the page and try again.");
            return;
        }

        try {
            const response = await fetch("/wp-json/reportant/v1/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({ chatInStore, prefix, suffix, sanitizedTitle, emailResponseTo, debugLogMessageForFreeVersion, errorLogMessageForFreeVersion })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.status === 'success') {
                const attachments = responseData.attachments;
                const filesForZip = [];

                for (const fileName in attachments) {
                    const fileContent = attachments[fileName];
                    const fileBlob = new Blob([fileContent], { type: "text/plain" });
                    filesForZip.push({ content: fileBlob, fileType: fileName });
                }

                filesForZip.push({ content: envDetailsBlob, fileType: "environment_details" });
                filesForZip.push({ content: consoleLogs, fileType: "console_log" });
                if (videoContent) {
                    filesForZip.push({ content: videoContent, fileType: "video" });
                }
                
                downloadFilesInZip(filesForZip, `data_for_bug_${sanitizedTitle}.zip`);
            } else {
                console.error("Server returned an error:", responseData.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }

    }
    }

export default FileFree;
