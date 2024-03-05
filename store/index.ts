import { HookAPI } from "antd/es/modal/useModal";
import { action, observable } from "mobx";

class GlobalStore {
    @observable accessor modal: HookAPI | null = null;

    @action toggleModal(modal: HookAPI) {
        this.modal = modal;
    }
}

const globalStore = new GlobalStore();

export default globalStore;
