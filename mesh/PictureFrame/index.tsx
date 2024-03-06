import * as BABYLON from "babylonjs";
import grass from "../../textures/grass.png";
import globalStore from "../../store";
import { UploadImg } from "../../components/UploadImg";
import * as React from "react";

function onClickFrame(event: BABYLON.ActionEvent, scene: BABYLON.Scene) {
    const pickResult = scene.pick(event.pointerX, event.pointerY);
    if (pickResult.hit) {
        const pickedMesh = pickResult.pickedMesh;
        const position = pickedMesh?.absolutePosition;
        console.log(
            "X:",
            position?.x.toFixed(2),
            "Y:",
            position?.y.toFixed(2),
            "Z:",
            position?.z.toFixed(2)
        );
    }
}

function frameWidthBehavior(frame: BABYLON.Mesh) {
    // 长按拖动相框
    const dragBehavior = new BABYLON.PointerDragBehavior({
        dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
    });
    frame.addBehavior(dragBehavior);

    let newPosition: BABYLON.Vector3 | null = null;

    dragBehavior.onDragObservable.add((event) => {
        // 获取相框的父节点
        const parent = frame.parent as any;
        const dragDelta = event.delta;

        // 计算相框的新位置
        newPosition = frame.position.add(
            new BABYLON.Vector3(dragDelta.x, 0, dragDelta.y)
        );

        // 限制相框的位置在平面内
        newPosition.z =
            Math.abs(newPosition.z) >= 4.5
                ? newPosition.z > 0
                    ? 4.5
                    : -4.5
                : newPosition.z;
        newPosition.y = newPosition.y >= 2 ? 2 : newPosition.y;
        newPosition.y = newPosition.y <= -1.5 ? -1.5 : newPosition.y;
    });

    dragBehavior.onDragEndObservable.add(() => {
        if (newPosition) {
            frame.position.copyFrom(newPosition);
        }
    });
}

function photoAddModalAction(photo: BABYLON.Mesh, scene: BABYLON.Scene) {
    photo.actionManager = new BABYLON.ActionManager(scene);
    photo.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            function (event) {
                globalStore.modal
                    ?.confirm({
                        title: "更换照片",
                        content: <UploadImg />,
                        centered: true,
                    })
                    .then(
                        (res) => {
                            if (res) {
                                const url = globalStore.pictureUrl;
                                globalStore.setPictureUrl("");

                                if (url) {
                                    const photoTexture = new BABYLON.Texture(
                                        url,
                                        scene
                                    );

                                    const photoMaterial =
                                        new BABYLON.StandardMaterial(
                                            "photoMaterial",
                                            scene
                                        );
                                    photoMaterial.diffuseTexture = photoTexture;

                                    photo.material = photoMaterial;
                                }
                            }
                        },
                        () => {}
                    );
            }
        )
    );
}

export function createPictureFrame(scene: BABYLON.Scene) {
    // 创建相框
    const frame = BABYLON.MeshBuilder.CreateBox(
        "frame",
        { width: 1, height: 0.2, depth: 1 },
        scene
    );
    globalStore.setAllowedControlMesh(frame as any);
    // 设置相框材质
    const frameMaterial = new BABYLON.StandardMaterial("frameMaterial", scene);
    frameMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.4);
    frame.material = frameMaterial;

    frame.rotate(BABYLON.Axis.Z, Math.PI / 2);
    frame.position.x = 0.3;

    // 相框点击事件
    frame.actionManager = new BABYLON.ActionManager(scene);
    frame.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            (event) => onClickFrame(event, scene)
        )
    );
    frameWidthBehavior(frame);

    const photo = BABYLON.MeshBuilder.CreatePlane(
        "photo",
        { size: 0.8 },
        scene
    );
    photo.parent = frame;
    photo.position.y = -0.12;
    photo.rotate(BABYLON.Axis.X, -Math.PI / 2);

    // 加载照片纹理
    const photoTexture = new BABYLON.Texture(grass, scene);
    const photoMaterial = new BABYLON.StandardMaterial("photoMaterial", scene);
    photoMaterial.diffuseTexture = photoTexture;
    photo.material = photoMaterial;

    photoAddModalAction(photo, scene);

    return frame;
}
