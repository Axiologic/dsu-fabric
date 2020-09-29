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
        const formData = new FormData();
        let inputType = "file";

        if (Array.isArray(fileData)) {
            for (const attachment of fileData) {
                inputType = "files[]";
                formData.append(inputType, attachment);
            }
        } else {
            formData.append(inputType, fileData);
        }
        doPost(url, formData, {headers: {"x-dossier-path": fileName}}, callback);
    }

    mount(transactionId, path, seed, callback){
        const url = `/mount/${transactionId}`;
        doPost(url, "", {
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