import globalStore from "../../store";

export function initRotateCircle(scene: BABYLON.Scene) {
    const circle = BABYLON.MeshBuilder.CreateTorus(
        "torus",
        { thickness: 0.1, diameter: 2 },
        scene
    );
    const material = new BABYLON.StandardMaterial("circleMaterial", scene);
    circle.material = material;
    circle.isVisible = false;
    // 点击事件处理函数
    scene.onPointerDown = function (evt, pickResult) {
        const mesh = pickResult.pickedMesh;

        if (mesh) {
            if (globalStore.allowedControlMesh.includes(mesh)) {
                circle.isVisible = true;
                circle.position = mesh.getAbsolutePosition();
                circle.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
                globalStore.setCurMesh(mesh);
            } else {
                if (mesh !== circle) {
                    globalStore.setCurMesh(null);
                    circle.isVisible = false;
                }
            }
        }
    };

    // 注册 ActionManager
    const actionManager = new BABYLON.ActionManager(scene);
    circle.actionManager = actionManager;
    let isMove = false;
    // 在 OnLongPressTrigger 触发器上注册一个动作
    actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickDownTrigger,
            function () {
                material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow color
                scene.activeCamera && scene.activeCamera.detachControl();

                isMove = true;
            }
        )
    );

    scene.onPointerMove = function (evt, pickResult) {
        if (circle.isVisible && isMove) {
            const deltaRotation = evt.movementX;
            console.log(
                "🚀 ~ initRotateCircle ~ deltaRotation:",
                deltaRotation
            );
            globalStore.curMesh?.rotate(
                BABYLON.Axis.X,
                deltaRotation * 0.01,
                BABYLON.Space.WORLD
            );
            console.log(
                "🚀 ~ initRotateCircle ~ curMesh:",
                globalStore.curMesh
            );
            circle.rotate(
                BABYLON.Axis.X,
                deltaRotation * 0.01,
                BABYLON.Space.WORLD
            );
        }
    };
    scene.onPointerUp = function () {
        material.diffuseColor = new BABYLON.Color3(1, 1, 1); // White color
        isMove = false;
        scene.activeCamera && scene.activeCamera.attachControl();
    };
}
