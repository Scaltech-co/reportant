
import * as store from "../../../store.js";
import FileFree from "./fileFree.js";

export function fileContentFactory() {
    return store.isFreeVersion() ? new FileFree() : new FileFree();
}
