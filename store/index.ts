import { HookAPI } from "antd/es/modal/useModal";
import { action, observable } from "mobx";

class GlobalStore {
    @observable accessor modal: HookAPI | null = null;
    @observable accessor pictureUrl: string = "";

    @action toggleModal(modal: HookAPI) {
        this.modal = modal;
    }

    @action setPictureUrl(url: string) {
        this.pictureUrl = url;
    }
}

const globalStore = new GlobalStore();

export default globalStore;
