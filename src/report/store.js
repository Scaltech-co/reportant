// store.js
import { writable, get } from 'svelte/store';

// Stores
export const titleInStore = writable("");
export const termsAgreeInStore = writable(false);
export const videoSrcInStore = writable(undefined);
export const videoUrlInStore = writable(undefined);
export const isRecordingStore = writable(false);
export const messages = writable([]);

// Getter functions
export function getTitle() {
  return get(titleInStore);
}

export function getMessages() {
  return get(messages);
}

// Mutating functions
export function addMessage(message) {
  messages.update(msgs => [...msgs, message]);
}

export function editMessage(id, newMessage) {
  messages.update(msgs => {
    const index = msgs.findIndex(msg => msg.id === id);
    if (index !== -1) {
      msgs[index] = { ...msgs[index], text: newMessage };
    }
    return [...msgs];
  });
}
