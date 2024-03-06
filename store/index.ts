import { HookAPI } from "antd/es/modal/useModal";
import { action, observable } from "mobx";

type Mesh = BABYLON.Mesh | BABYLON.AbstractMesh | null;
class GlobalStore {
    @observable accessor modal: HookAPI | null = null;
    @observable accessor pictureUrl: string = "";
    @observable accessor allowedControlMesh: object[] = [];
    @observable accessor curMesh: Mesh = null;

    @action toggleModal(modal: HookAPI) {
        this.modal = modal;
    }

    @action setPictureUrl(url: string) {
        this.pictureUrl = url;
    }

    @action setAllowedControlMesh(mesh: object) {
        this.allowedControlMesh.push(mesh);
    }

    @action setCurMesh(mesh: Mesh) {
        this.curMesh = mesh;
    }
}

const globalStore = new GlobalStore();

export default globalStore;
