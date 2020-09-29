import utils from "./utils.js";
const doPost = utils.getPostHandlerFor("dsuWizard");

export default class DSU_Builder {
    constructor() {
    }

    getTransactionId(callback) {
        doPost("/begin", callback)
    }

    setDLDomain(transactionId, dlDomain, callback) {
        const url = `/setDLDomain/${transactionId}`;
        doPost(url, dlDomain, callback);
    }

    setSeedKey(transactionId, seedKey, callback) {
        const url = `/setSeedKey/${transactionId}`;
        doPost(url, seedKey, callback);

    }

    addFileDataToDossier(transactionId, fileName, fileData, callback) {
        const url = `/addFile/${transactionId}`;
        doPost(url, fileData, {headers: {"x-dossier-path": fileName}}, callback);
    }

    mount(transactionId, path, seed, callback){
        const url = `/mount/${transactionId}`;
        doPost(url, {
            headers: {
                'x-mount-path': path,
                'x-mounted-dossier-seed': seed
            }
        }, callback);
    }

    buildDossier(transactionId, callback) {
        const url = `/build/${transactionId}`;
        doPost(url, "", callback);
    }
}