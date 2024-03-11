import * as GUI from "babylonjs-gui";
import globalStore from "../../store";
import { CardList } from "../../components/CardList";
import * as React from "react";
import groundTexture from "../../assets/textures/ground.jpg";
import grassTexture from "../../assets/textures/grass.png";
import floorTexture from "../../assets/textures/floor.png";

export function createSpaceMaterialButton(
    wall1,
    wall2,
    ground,
    mat1,
    mat2,
    mat3
) {
    // 创建按钮
    const button = GUI.Button.CreateSimpleButton("button", "空间材料");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.left = "10px";
    button.top = "10px";
    button.background = "green";
    button.cornerRadius = 10;

    button.onPointerUpObservable.add(function () {
        const _modal = globalStore.modal;
        if (!_modal) {
            return;
        }
        const modal = _modal.confirm({
            title: "选择材料",
            content: (
                <CardList
                    onSelect={onSelect}
                    list={[
                        {
                            url: grassTexture,
                            val: mat1,
                        },
                        {
                            url: groundTexture,
                            val: mat2,
                        },
                        {
                            url: floorTexture,
                            val: mat3,
                        },
                    ]}
                />
            ),
            centered: true,
            width: 820,
            closable: true,
            footer: null,
        });

        function onSelect(item) {
            const { val } = item;
            wall1.material = val;
            wall2.material = val;
            ground.material = val;
            modal.destroy();
        }
    });

    return button;
}
