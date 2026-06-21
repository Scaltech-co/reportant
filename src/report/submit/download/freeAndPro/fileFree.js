import FileBase from './fileBase.js';
import { get } from 'svelte/store';
import { videoUrlInStore, getMessages, titleInStore } from '../../../store.js';
import {
    generatePrefix,
    generateSuffix,
    returnEmailByClass,
    downloadFilesInZip,
    getSanitizedTitle,
} from '../../FileFunctions.js';
import DOMPurify from 'dompurify';

class FileFree extends FileBase {
    async download() {
        const chatInStore = getMessages();
        const prefix = generatePrefix();
        const suffix = generateSuffix();
        const sanitizedTitle = DOMPurify.sanitize(titleInStore.value || '');
        const emailResponseTo = returnEmailByClass('emailResponseTo');
        const videoUrl = get(videoUrlInStore);
        const csrfToken = window.reportant_csrf_nonce;

        let videoContent = null;
        if (videoUrl) {
            videoContent = await fetch(videoUrl).then((res) => res.blob());
        }

        if (!csrfToken) {
            alert('CSRF token is missing. Please refresh the page and try again.');
            return;
        }

        try {
            const response = await fetch('/wp-json/reportant/v1/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ chatInStore, prefix, suffix, sanitizedTitle, emailResponseTo }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.status === 'success') {
                const attachments = responseData.attachments;
                const filesForZip = [];

                if (attachments.chat_messages) {
                    filesForZip.push({
                        content: new Blob([attachments.chat_messages], { type: 'text/html' }),
                        fileType: 'chat_messages',
                    });
                }

                if (videoContent) {
                    filesForZip.push({ content: videoContent, fileType: 'video' });
                }

                if (filesForZip.length === 0) {
                    return;
                }

                downloadFilesInZip(filesForZip, `data_for_bug_${sanitizedTitle}.zip`);
            } else {
                console.error('Server returned an error:', responseData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export default FileFree;
