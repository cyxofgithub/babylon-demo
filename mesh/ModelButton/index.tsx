import * as GUI from "babylonjs-gui";
import globalStore from "../../store";
import { CardList } from "../../components/CardList";
import * as React from "react";
import Assets from "../../assets/index.js";
import Chair from "../../assets/mesh/Chair/Chair.obj";

export function createModelButton(scene) {
    // 创建按钮
    const meshButton = GUI.Button.CreateSimpleButton("meshButton", "模型");
    meshButton.width = "150px";
    meshButton.height = "40px";
    meshButton.color = "white";
    meshButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    meshButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    meshButton.left = "170px";
    meshButton.top = "10px";

    meshButton.background = "green";
    meshButton.cornerRadius = 10;
    meshButton.onPointerUpObservable.add(function () {
        const num = Math.round(Math.random());

        // 创建一个指针拖动行为
        const dragBehavior = new BABYLON.PointerDragBehavior({
            dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
        });
        dragBehavior.useObjectOrientationForDragging = false;

        if (num) {
            BABYLON.SceneLoader.ImportMesh(
                "",
                Chair,
                "",
                scene,
                function (meshes) {
                    // 创建一个空的父节点
                    const parentNode = new BABYLON.TransformNode("ParentNode");
                    parentNode.addBehavior(dragBehavior);
                    // 遍历导入的网格
                    for (let i = 0; i < meshes.length; i++) {
                        meshes[i].parent = parentNode;
                        // 设置网格的缩放
                        meshes[i].scaling = new BABYLON.Vector3(
                            0.02,
                            0.02,
                            0.02
                        ); // 设置为2倍大小
                    }
                }
            );
        } else {
            BABYLON.SceneLoader.ImportMesh(
                null,
                Assets.meshes.vintageFan_animated.rootUrl,
                Assets.meshes.vintageFan_animated.filename,
                scene,
                function (meshes) {
                    // 创建一个空的父节点
                    const parentNode = new BABYLON.TransformNode("ParentNode");
                    parentNode.addBehavior(dragBehavior);
                    // 遍历导入的网格
                    for (let i = 0; i < meshes.length; i++) {
                        meshes[i].parent = parentNode;
                        // 设置网格的缩放
                        meshes[i].scaling = new BABYLON.Vector3(
                            0.02,
                            0.02,
                            0.02
                        ); // 设置为2倍大小
                    }
                    parentNode.position.y = 0.25;
                }
            );
        }
    });

    return meshButton;
}
