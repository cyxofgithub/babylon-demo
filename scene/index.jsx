import { createPictureFrame } from "../mesh/PictureFrame/index.tsx";
import { createVideoPlane } from "../mesh/VideoPlane/index.ts";
import * as GUI from "babylonjs-gui";
import groundTexture from "../assets/textures/ground.jpg";
import grassTexture from "../assets/textures/grass.png";
import floorTexture from "../assets/textures/floor.png";
import { initRotateCircle } from "../mesh/RotateCircle/index.ts";
import { createSpaceMaterialButton } from "../mesh/SpaceMaterialButton/index.tsx";
import { createModelButton } from "../mesh/ModelButton/index.tsx";

export const createScene = (engine, canvas) => {
    const scene = new BABYLON.Scene(engine);
    // 设置场景的背景颜色
    // scene.clearColor = new BABYLON.Color3.FromHexString("#e5e8d8");

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

    initRotateCircle(scene);
    createVideoPlane(scene);
    const PictureFrame = createPictureFrame(scene);

    const mat3 = new BABYLON.StandardMaterial("mat3");
    mat3.diffuseTexture = new BABYLON.Texture(floorTexture);

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

    PictureFrame.parent = wall1;

    wall2.position = new BABYLON.Vector3(
        -0.25,
        2.25,
        ground.position.z + boxDepth / 2 + wallThickness / 2
    );

    // 将材质应用于盒子
    wall1.material = mat3;
    wall2.material = mat3;



    const mat1 = new BABYLON.StandardMaterial("grass", scene);
    mat1.diffuseTexture = new BABYLON.Texture(grassTexture, scene);

    const mat2 = new BABYLON.StandardMaterial("ground", scene);
    mat2.diffuseTexture = new BABYLON.Texture(groundTexture, scene);
    mat2.diffuseTexture.uScale = 6;
    mat2.diffuseTexture.vScale = 6;
    mat2.specularColor = new BABYLON.Color3(0, 0, 0);

    const button = createSpaceMaterialButton(wall1, wall2, ground, mat1, mat2, mat3);
    const meshButton = createModelButton(scene);

    // 将按钮添加到画布上
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.addControl(button);
    advancedTexture.addControl(meshButton);



    scene.debugLayer.show();
    scene.clearColor = new BABYLON.Color4(224 / 255, 211 / 255, 207 / 255, 1);

    return scene;
};
