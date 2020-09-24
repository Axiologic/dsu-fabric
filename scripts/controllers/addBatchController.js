import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Batch from "../models/Batch.js";
import Countries from "../models/Countries.js";

export default class addBatchController extends ContainerController {
    constructor(element, history) {
        super(element);
        let batch = new Batch();
        this.setModel(batch);
        this.model.countries = {
            label: "Country",
            placeholder: "Select a country",
            options: Countries.getListAsVM()
        };
        this.on("add-batch", () => {
            let batches = localStorage.getItem("batches");
            if (!batches) {
                batches = [];
            } else {
                batches = JSON.parse(batches);
            }
            batches.push(batch);
            localStorage.setItem("batches", JSON.stringify(batches));
            history.push("?batches");
        });
    }
};