import * as BABYLON from "babylonjs";

import oceanViedeo from "../../video/oceans.mp4";

export function createVideoPlane(scene: BABYLON.Scene) {
    const planeOpts = {
        height: 4,
        width: 8.5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    };

    const ANote0Video = BABYLON.MeshBuilder.CreatePlane(
        "plane",
        planeOpts,
        scene
    );
    const vidPos = new BABYLON.Vector3(-0.07, 2.44, 4.88);
    ANote0Video.position = vidPos;
    const ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
    const ANote0VideoVidTex = new BABYLON.VideoTexture(
        "vidtex",
        // "./video/oceans.mp4",
        oceanViedeo,
        scene
    );
    ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
    ANote0VideoMat.roughness = 1;
    // ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
    ANote0Video.material = ANote0VideoMat;
}
