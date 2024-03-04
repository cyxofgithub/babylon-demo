import * as BABYLON from "babylonjs";
import grass from "../../textures/grass.png";

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

export function createPictureFrame(scene: BABYLON.Scene) {
    // 创建相框
    const frame = BABYLON.MeshBuilder.CreateBox(
        "frame",
        { width: 1, height: 0.2, depth: 1 },
        scene
    );
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

    // 长按拖动相框
    const dragBehavior = new BABYLON.PointerDragBehavior({
        dragAxis: new BABYLON.Vector3(1, 0, 0),
    });
    frame.addBehavior(dragBehavior);

    dragBehavior.onDragStartObservable.add(() => {
        console.log("Drag Start");
    });

    dragBehavior.onDragObservable.add((event) => {
        // 获取相框的父节点
        const parent = frame.parent as any;
        const dragDelta = event.delta;
        console.log(
            "🚀 ~ dragBehavior.onDragObservable.add ~ dragDelta:",
            dragDelta
        );
        const newFramePosition = frame.position.add(dragDelta);

        if (parent) {
            // 获取父节点的边界范围
            const parentMin = parent.getBoundingInfo().boundingBox.minimum;
            console.log(
                "🚀 ~ dragBehavior.onDragObservable.add ~ parentMin:",
                parentMin
            );
            const parentMax = parent.getBoundingInfo().boundingBox.maximum;

            // 限制相框在父节点范围内拖动
            newFramePosition.x = Math.min(
                Math.max(newFramePosition.x, parentMin.x),
                parentMax.x
            );
            newFramePosition.y = Math.min(
                Math.max(newFramePosition.y, parentMin.y),
                parentMax.y
            );
            newFramePosition.z = Math.min(
                Math.max(newFramePosition.z, parentMin.z),
                parentMax.z
            );

            // 更新相框的位置
            frame.position.copyFrom(newFramePosition);
        }

        frame.position.addInPlace(dragDelta);
    });

    dragBehavior.onDragEndObservable.add(() => {
        console.log("Drag End");
    });

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

    return frame;
}
