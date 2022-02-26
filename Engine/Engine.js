export { default as Scene } from "./Scene.js"
export { default as GameObject } from "./GameObject.js"
export { default as Component } from "./Component.js"
export { default as Input } from "./Input.js"
export { default as SceneManager } from "./SceneManager.js"
export { default as Vector } from "./Geometry/Vector.js"
export * as EngineComponents from "./Components/EngineComponents.js"
export * as EngineGeometry from "./Geometry/EngineGeometry.js"
import Scene from "./Scene.js"
import GameObject from "./GameObject.js"
import Component from "./Component.js"
import Input from "./Input.js"
import SceneManager from "./SceneManager.js"
import Vector from "./Geometry/Vector.js"
import * as EngineComponents from "./Components/EngineComponents.js"
import * as EngineGeometry from "./Geometry/EngineGeometry.js"

class Engine {

  static boot(document, options) {


    Engine.SceneManager.allComponents = [...Object.keys(Engine.EngineComponents).map(i => EngineComponents[i]), ...Object.keys(options.GameComponents).map(i => options.GameComponents[i])];
    Engine.SceneManager.allPrefabs = Object.keys(options.GamePrefabs).map(i => options.GamePrefabs[i]);
    Engine.SceneManager.allScenes = Object.keys(options.GameScenes).map(i => options.GameScenes[i]);
    Engine.SceneManager.changeScene(options.mainSceneTitle);


    Engine.Input.attach(document);

    //This will be our default size unless it is set in the options
    let width = 640;
    let height = 480;
    if (options?.width) width = options.width;
    if (options?.height) height = options.height;
    Engine.SceneManager.screenWidth = width;
    Engine.SceneManager.screenHeight = height;
    Engine.SceneManager.screenAspectRatio = width / height;

    //Add the main canvas to the DOM
    let canvas = document.createElement("canvas");
    canvas.id = "canv";
    document.body.appendChild(canvas);
    /* Setup our canvas */
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
    let ctx = canvas.getContext("2d");

    let deferredCanvas = document.createElement("canvas");
    let dctx = deferredCanvas.getContext("2d");
    dctx.name = "Default Canvas"

    let wrapCanvas = document.createElement("canvas");
    let wrapctx = wrapCanvas.getContext("2d");
    wrapctx.name = "Special Effects Canvas"

    globalThis.bufferCanvas = document.createElement("canvas");
    globalThis.bctx = bufferCanvas.getContext("2d");
    globalThis.bufferCanvas.width = 2 * Engine.SceneManager.screenWidth;
    globalThis.bufferCanvas.height = 2 * Engine.SceneManager.screenHeight;

    globalThis.blurCanvas = document.createElement("canvas");
    globalThis.bbctx = blurCanvas.getContext("2d");
    globalThis.blurCanvas.width = 2 * Engine.SceneManager.screenWidth;
    globalThis.blurCanvas.height = 2 * Engine.SceneManager.screenHeight;

    //Setup the CSS
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden"

    let title = options.title;
    //Set the title the title argument or location if title is missing
    if (!options.title) title = location;
    document.title = title;



    deferredCanvas.width = width;
    deferredCanvas.height = height;

    wrapCanvas.width = width * 2;
    wrapCanvas.height = height * 2;

    let drawingLayers;
    if (options.layers) {
      drawingLayers = options.layers.map(i => {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return { name: i, ctx: canvas.getContext("2d") }
      })
    }
    else {
      drawingLayers = [
        { name: "default", ctx: dctx },
        { name: "wrap", ctx: wrapctx }
      ]
    }

    if (!drawingLayers.some(i => i.name == "default"))
      drawingLayers.splice(0, 0, { name: "default", ctx: dctx })

    let wrap = drawingLayers.find(i => i.name == "wrap");
    if (wrap)
      wrap.ctx = wrapctx;

    let video = document.createElement("video");
    video.autoplay = true;
    //var video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong! " + error);
        });
    }

    let webcamCanvas = canvas
    let webcamCtx = webcamCanvas.getContext("2d");
    window.requestAnimationFrame(gameLoop, webcamCanvas);
    let track = null;
    let settings = null;

    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");

    let secondCanvas = document.createElement("canvas");
    let secondCtx = secondCanvas.getContext("2d");


    /* Update and draw our game */
    function gameLoop() {
      let fps = 60;
      setInterval(gameLoop, 1000 / fps)
      if (options.webcam) {
        if (video.srcObject || track) {
          track = video.srcObject.getTracks()[0];
          settings = track.getSettings();

          //document.body.appendChild(tempCanvas);

          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          let videoWidth = settings.width;
          let videoHeight = settings.height;

          tempCanvas.width = videoWidth;
          tempCanvas.height = videoHeight;
          secondCanvas.width = videoWidth;
          secondCanvas.height = videoHeight;

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let scaleX = 1;
          let scaleY = 1;
          let proposedScaleX = window.innerWidth / settings.width;
          let proposedScaleY = window.innerHeight / settings.height;
          let scale = Math.min(proposedScaleX, proposedScaleY);



          let offsetX = 0;
          let offsetY = 0;



          if (scale != proposedScaleX) {
            offsetX = (proposedScaleX - scale) * videoWidth / 2
          }
          else {
            offsetY = (proposedScaleY - scale) * videoHeight / 2
          }

          tempCtx.drawImage(video, 0, 0, settings.width, settings.height);

          let pixels = tempCtx.getImageData(0, 0, settings.width, settings.height);


          for (let y = 0; y < videoHeight; y++) {
            for (let x = 0; x < videoWidth; x++) {
              //The data is linear, get the x,y coordinate
              //We mulitply by 4 since it is stored as rgba
              let pixelIndex = videoWidth * 4 * y + x * 4;

              //Convert to grayscale on half the image
              if (true) {
                let r = pixels.data[pixelIndex];
                let g = pixels.data[pixelIndex + 1];
                let b = pixels.data[pixelIndex + 2];

                //Trivial grayscale conversion using the red channel
                g = r;
                b = r;

                //Update the pixel data
                pixels.data[pixelIndex] = r;
                pixels.data[pixelIndex + 1] = g;
                pixels.data[pixelIndex + 2] = b;
              }
            }
          }


          secondCtx.putImageData(pixels, 0, 0);
          console.log(scale);

          console.log(offsetY);
          ctx.drawImage(secondCanvas, 0, 0, videoWidth, videoHeight,
            offsetX, offsetY, scale * videoWidth, scale * videoHeight);

          //ctx.putImageData(pixels, offsetX, offsetY);




          window.requestAnimationFrame(gameLoop, canvas);



        }
        else {
          ctx.fillStyle = "magenta"
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          window.requestAnimationFrame(gameLoop, canvas);

        }
      }
      else {
        Engine.Input.SwapArrays();
        let currentScene = Engine.SceneManager.currentScene;
        currentScene.draw(drawingLayers);
        currentScene.update();
        currentScene.cullDestroyed();

        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        let cw = ctx.canvas.width;
        let ch = ctx.canvas.height;

        let dw = dctx.canvas.width;
        let dh = dctx.canvas.height;

        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, cw, ch);



        //Draw centered and scaled to fit the window
        let dAspectRatio = dw / dh;
        let cAspectRatio = cw / ch;

        let w = cw;
        let h = ch;
        if (dAspectRatio < cAspectRatio) {
          w = h * dAspectRatio;
        }
        else {
          h = w / dAspectRatio
        }
        ctx.drawImage(deferredCanvas, (cw - w) / 2, (ch - h) / 2, w, h);
        Engine.Input.Remap = p => {
          let x = p.x;
          let y = p.y;

          x -= (cw - w) / 2;
          y -= (ch - h) / 2;

          x *= dw / w;
          y *= dh / h;
          x -= width / 2;
          y -= height / 2

          return new Vector(x, y);
        }
      }

    }

    let fps = 60;
    setInterval(gameLoop, 1000 / fps)


  }

}



Engine.SceneManager = SceneManager;
Engine.EngineGeometry = EngineGeometry;
Engine.SceneManager.Geometry = Engine.EngineGeometry;
Engine.Scene = Scene;
Engine.GameObject = GameObject;
Engine.Component = Component;
Engine.Input = Input;
Engine.SceneManager = SceneManager;
Engine.Vector = Vector;
Engine.EngineComponents = EngineComponents;

globalThis.Instantiate = i => Engine.SceneManager.currentScene.instantiate(i);
globalThis.Destroy = g => g.destroy();
globalThis.GameObject = Engine.GameObject;
globalThis.Engine = Engine;
globalThis.Input = Engine.Input;
globalThis.Geometry = EngineGeometry;
globalThis.GetGameObject = (name) => Engine.SceneManager.currentScene.getGameObject(name);

export default Engine;