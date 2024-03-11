import * as BABYLON from "babylonjs";
import React, { useEffect, useRef } from "react";
import { Modal } from "antd";
import { Provider } from "mobx-react";
import globalStore from "./store/index.ts";
import { createScene } from "./scene/index.jsx";

function App() {
    const canvas = useRef(null);
    const [modal, contextHolder] = Modal.useModal();

    let sceneToRender = useRef(null);

    const startRenderLoop = function (engine) {
        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.current?.activeCamera) {
                sceneToRender.current.render();
            }
        });
    };
    async function initFunction() {
        window.engine = new BABYLON.Engine(canvas.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false,
        });

        if (!engine) throw "engine should not be null.";
        startRenderLoop(engine, canvas);
        window.scene = createScene();
    }

    useEffect(() => {
        if (canvas.current) {
            initFunction().then(() => {
                sceneToRender.current = scene;
            });

            // Resize
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
    }, [canvas.current]);

    useEffect(() => {
        modal && globalStore.toggleModal(modal);
    }, [modal]);

    return (
        <Provider globalStore={globalStore}>
            <div id="canvasZone">
                <canvas id="renderCanvas" ref={canvas}></canvas>
                {contextHolder}
            </div>
        </Provider>
    );
}

export default App;
