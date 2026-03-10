// store.js
import { writable, get } from 'svelte/store';

// Stores
export const titleInStore = writable("");
export const termsAgreeInStore = writable(false);
export const videoSrcInStore = writable(undefined);
export const videoUrlInStore = writable(undefined);
export const envDetailsInStore = writable(undefined);
export const isRecordingStore = writable(false);
export const messages = writable([]);

// Static function
export function isFreeVersion() {
  return true;
}

// Getter functions
export function getTitle() {
  return get(titleInStore); // get() pulls current value
}

export function getEnvDetails() {
  return get(envDetailsInStore);
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
