import * as BABYLON from "babylonjs";
import "@babylonjs/loaders";
import * as GUI from "babylonjs-gui";
import groundTexture from "./textures/ground.jpg";
import Assets from "./Assets/index.js";
import "babylonjs-loaders";
import { createVideoPlane } from "./mesh/VideoPlane/index.ts";

const canvas = document.getElementById("renderCanvas");

const startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
};

var sceneToRender = null;
const createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
    });
};
const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    // 设置场景的背景颜色
    // scene.clearColor = new BABYLON.Color3.FromHexString("#e5e8d8");
    createVideoPlane(scene);

    scene.onPointerObservable.add(function (evt) {
        if (evt.pickInfo.pickedMesh === ANote0Video) {
            //console.log("picked");
            if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
            else ANote0VideoVidTex.video.pause();
            console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
        }
    }, BABYLON.PointerEventTypes.POINTERPICK);

    /**** Set camera and light *****/
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        new BABYLON.Vector3(0, 0, 0)
    );

    // 限制相机在垂直方向上的旋转角度范围
    camera.lowerBetaLimit = 0.1; // 最小角度
    camera.upperBetaLimit = Math.PI / 2; // 最大角度

    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1, 1, 0)
    );

    const mat3 = new BABYLON.StandardMaterial("mat3");
    mat3.diffuseTexture = new BABYLON.Texture(
        "https://www.babylonjs-playground.com/textures/floor.png"
    );

    const boxWidth = 10;
    const boxHeight = 0.5;
    const boxDepth = 10;

    const ground = BABYLON.MeshBuilder.CreateBox(
        "box",
        { width: boxWidth, height: boxHeight, depth: boxDepth },
        scene
    );

    ground.material = mat3;

    const wallThickness = boxHeight;
    const wallHeight = boxDepth / 2;
    const wallDepth = boxDepth;

    const wall1 = BABYLON.MeshBuilder.CreateBox(
        "wall1",
        {
            width: wallThickness,
            height: wallHeight,
            depth: wallDepth,
        },
        scene
    );
    wall1.position = new BABYLON.Vector3(
        ground.position.x - boxWidth / 2 - wallThickness / 2,
        2.25,
        ground.position.z
    );

    const wall2 = BABYLON.MeshBuilder.CreateBox(
        "wall2",
        {
            width: boxWidth + 0.5,
            height: wallHeight,
            depth: wallThickness,
        },
        scene
    );

    wall2.position = new BABYLON.Vector3(
        -0.25,
        2.25,
        ground.position.z + boxDepth / 2 + wallThickness / 2
    );

    // 将材质应用于盒子
    wall1.material = mat3;
    wall2.material = mat3;
    // 创建按钮
    const button = GUI.Button.CreateSimpleButton("button", "material");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.top = "10px";
    button.background = "green";
    button.cornerRadius = 10;

    // 创建按钮
    const meshButton = GUI.Button.CreateSimpleButton("meshButton", "mesh");
    meshButton.width = "150px";
    meshButton.height = "40px";
    meshButton.color = "white";
    meshButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    meshButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    meshButton.left = "160px";
    meshButton.top = "10px";

    meshButton.background = "green";
    meshButton.cornerRadius = 10;

    // Create tri-planar material
    // const mat1 = new BABYLON.TriPlanarMaterial("triplanar", scene);
    // mat1.diffuseTextureX = new BABYLON.Texture("textures/rock.png", scene);
    // mat1.diffuseTextureY = new BABYLON.Texture("textures/grass.png", scene);
    // mat1.diffuseTextureZ = new BABYLON.Texture("textures/floor.png", scene);
    // mat1.normalTextureX = new BABYLON.Texture("textures/rockn.png", scene);
    // mat1.normalTextureY = new BABYLON.Texture("textures/grassn.png", scene);
    // mat1.normalTextureZ = new BABYLON.Texture("textures/rockn.png", scene);
    // mat1.specularPower = 32;
    // mat1.tileSize = 1.5;

    const mat2 = new BABYLON.StandardMaterial("ground", scene);
    mat2.diffuseTexture = new BABYLON.Texture(groundTexture, scene);
    mat2.diffuseTexture.uScale = 6;
    mat2.diffuseTexture.vScale = 6;
    mat2.specularColor = new BABYLON.Color3(0, 0, 0);
    button.onPointerUpObservable.add(function () {
        const num = Math.floor(Math.random() * 3);
        // const mats = [mat1, mat2, mat3];
        const mats = [mat2, mat3];

        const curMat = mats[num];
        wall1.material = curMat;
        wall2.material = curMat;
        ground.material = curMat;
    });

    // 创建一个指针拖动行为
    const dragBehavior = new BABYLON.PointerDragBehavior({
        dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
    });
    dragBehavior.useObjectOrientationForDragging = false;

    // 将按钮添加到画布上
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.addControl(button);
    advancedTexture.addControl(meshButton);

    meshButton.onPointerUpObservable.add(function () {
        const num = Math.round(Math.random());

        if (num) {
            BABYLON.SceneLoader.ImportMesh(
                "",
                Assets.meshes.Chair.rootUrl,
                Assets.meshes.Chair.filename,
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

    scene.debugLayer.show();
    scene.clearColor = new BABYLON.Color4(224 / 255, 211 / 255, 207 / 255, 1);

    return scene;
};

window.initFunction = async function () {
    const asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log(
                "the available createEngine function failed. Creating the default engine instead"
            );
            return createDefaultEngine();
        }
    };

    window.engine = await asyncEngineCreation();
    if (!engine) throw "engine should not be null.";
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
