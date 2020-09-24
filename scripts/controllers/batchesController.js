import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import Batch from "../models/Batch.js";
export default class batchesController extends ContainerController {
    constructor(element, history) {
        super(element);
        let batches = JSON.parse(localStorage.getItem("batches"));
        const model = {batches: []};
        if (batches) {
            batches.forEach(batch => model.batches.push(new Batch(batch)));
        }

        this.setModel(model);

        this.on("add-batch", () => {
            history.push("?add-batch");
        });
    }
}
