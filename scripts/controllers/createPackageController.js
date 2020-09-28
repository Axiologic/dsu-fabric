import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Package from '../models/Package.js';
import DSU_Builder from "../services/DSU_Builder.js";
import Batch from "../models/Batch.js";
import Countries from "../models/Countries.js";

export default class createPackageController extends ContainerController {
    constructor(element, history) {
        super(element);

        this.setModel({});
        this.model.package = new Package();

        let batches = localStorage.getItem("batches");
        if (!batches) {
            batches = [];
        } else {
            batches = JSON.parse(batches);
        }

        let options = [];
        batches.forEach(batch => options.push(new Batch(batch).generateViewModel()));
        this.model.batches = {
            label: "Batch",
            placeholder: "Select a batch",
            options: options
        };
        
        this.on('openFeedback', (e) => {
            this.feedbackEmitter = e.detail;
        });

        this.model.onChange("batches.value", (event)=>{
            let batch = batches.find(batch => batch.batchNumber === this.model.batches.value);
            this.model.expiration = batch.expiration;
            this.model.leaflet = batch.leaflet;
            this.model.country = Countries.getCountry(batch.country);
        })

        this.on("save-package", (event) => {
            let product = this.model;
            this.buildPackageDSU(product, (err, seed) => {
                this.showError(err);
                let packageHistory = localStorage.getItem("packageHistory");
                if (!packageHistory) {
                    packageHistory = [];
                } else {
                    packageHistory = JSON.parse(packageHistory);
                }

                packageHistory.unshift(seed);
                localStorage.setItem("packageHistory", JSON.stringify(packageHistory));
                history.push("?packages");
            });
        });
    }

    buildPackageDSU(description, callback) {
        const DESCRIPTION_FILE_NAME = "description.json";
        const LEAFLET_MOUNT_PATH = "/leaflet";
        const dossierBuilder = new DSU_Builder();
        dossierBuilder.getTransactionId((err, transactionId) => {
            if (err) {
                return callback(err);
            }
            dossierBuilder.setSeedKey(transactionId, description.serialID, (err) => {
                if (err) {
                    return callback(err);
                }
                dossierBuilder.addFileDataToDossier(transactionId, DESCRIPTION_FILE_NAME, JSON.stringify(description), (err) => {
                    if (err) {
                        return callback(err);
                    }

                    dossierBuilder.mount(transactionId, LEAFLET_MOUNT_PATH, description.leaflet, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        dossierBuilder.buildDossier(transactionId, callback);
                    });
                })
            })
        });
    }

    showError(err, title, type) {
        let errMessage;
        title = title ? title : 'Validation Error';
        type = type ? type : 'alert-danger';

        if (err instanceof Error) {
            errMessage = err.message;
        } else if (typeof err === 'object') {
            errMessage = err.toString();
        } else {
            errMessage = err;
        }
        this.feedbackEmitter(errMessage, title, type);
    }
}
