import { EngineComponents } from "./engine.js";
import GameObject from "./GameObject.js"
import SceneManager from "./SceneManager.js"

export default class Scene {

    children = [];

    static deserializeObject(objectDefinition, sceneStart = true) {
        let gameObject;
        let gameObjectDefinition;
        if (objectDefinition.prefabName) 
            gameObjectDefinition = SceneManager.allPrefabs.find(i => i.name == objectDefinition.prefabName);
        else 
            gameObjectDefinition = objectDefinition.gameObject;

        if (!gameObjectDefinition) throw "Could not find a prefab or game object description (deserializeObject) in " + JSON.stringify(objectDefinition, null, 2)
        gameObject = GameObject.deserialize(gameObjectDefinition); //Deserialize the object
        gameObject.transform.position.x = objectDefinition.x || 0; //Set the x or default to 0. 
        gameObject.transform.position.y = objectDefinition.y || 0; //Set the y or default to 0
        gameObject.transform.scale.x = objectDefinition.sx || 1; //Set the x or default to 0.
        gameObject.transform.scale.y = objectDefinition.sy || 1; //Set the y or default to 0
        gameObject.transform.rotation = objectDefinition.r || 0; //Set the y or default to 0
        gameObject.drawLayer = objectDefinition.drawLayer || "default";

        if (objectDefinition.enabled == true || objectDefinition.enabled == false) {
            gameObject._enabled = objectDefinition.enabled;
        }
        else
            gameObject._enabled = true; 

      
        if (gameObject.enabled && !sceneStart) {

            gameObject.callMethod("awake");
            gameObject.callMethod("onEnable");
            gameObject.callMethod("start");
        }
        return gameObject
    }

    static deserialize(sceneDefinition) {
        let toReturn = new Scene(); 
        toReturn.name = sceneDefinition.name; 
        if (sceneDefinition.children)
            for (let objectDefinition of sceneDefinition.children) {
                let gameObject = this.deserializeObject(objectDefinition)
                toReturn.addChild(gameObject);
            }
        return toReturn;
    }


    getChildren() {
        return this.children;
    }


    addChild(child) {
        this.children.push(child)
    }

    draw(layers) {
        layers.forEach(l => l.ctx.clearRect(0, 0, l.ctx.canvas.width, l.ctx.canvas.height));
        bctx.clearRect(0, 0, bctx.canvas.width, bctx.canvas.height);
        bbctx.clearRect(0, 0, bbctx.canvas.width, bbctx.canvas.height);
        let dctx = layers.find(i => i.name == "default").ctx


        dctx.fillStyle = this.camera.getComponent("WorldCameraComponent").color;
        dctx.fillRect(0, 0, dctx.canvas.width, dctx.canvas.height);
        dctx.save();

       
        for (let layer of layers) {
            if(layer.name=="screen") continue;
            let ctx = layer.ctx;
            ctx.save();
            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
            ctx.translate(this.camera.transform.position.x, this.camera.transform.position.y)
            ctx.scale(this.camera.transform.scale.x, this.camera.transform.scale.y)
            ctx.rotate(this.camera.transform.rotation);
        }
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.name == "ScreenCamera") continue;
            child.draw(layers);
        }
        for (let layer of layers) {
            let ctx = layer.ctx;
            ctx.restore();
        }
        dctx.restore();

        dctx.save();
        this.screenCamera.draw(layers)
        dctx.restore();

        let debugLayerWidth = 70;
        for (let i = 0; i < layers.length; i++) {
            let thisCtx = layers[i].ctx;
            let thisCanvas = thisCtx.canvas
            let renderedHeight = debugLayerWidth * thisCanvas.height / thisCanvas.width;
            layers[0].ctx.fillStyle = "rgba(128, 128, 128, .5)"
            layers[0].ctx.fillRect(0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)
            layers[0].ctx.drawImage(thisCanvas, 0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)

            layers[0].ctx.strokeStyle = "blue";
            if (layers[i].name == "wrap") {
                layers[0].ctx.strokeRect(debugLayerWidth/4, (i) * debugLayerWidth + renderedHeight * .25, debugLayerWidth/2, .5 * renderedHeight)
            }

            layers[0].ctx.strokeRect(0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)

            layers[0].ctx.fillStyle = "white"
            let measure = layers[0].ctx.measureText(layers[i].name).width
            layers[0].ctx.fillText(layers[i].name,  + debugLayerWidth/2 - measure/2, (i+.4)*debugLayerWidth)

        }

    }

    get camera() {
        return this.getGameObject("MainCamera");
    }
    get screenCamera() {
        return this.getGameObject("ScreenCamera")
    }


    update() {
        for (let child of this.children) {
            child.update();
        }
    }

    cullDestroyed() {
        let newChildren = [];
        for (let child of this.children) {
            if (!child.markedDestroy)
                newChildren.push(child);
        }
        this.children = newChildren;
    }

    getGameObject(name) {
        for (let child of this.children) {
            if (child.name == name) return child;
            let foundChild = child.getGameObject(name);
            if (foundChild) return foundChild;
        }
         }

  
    instantiate(objectDescription) {
        let newObject = Scene.deserializeObject(objectDescription, false);
        this.addChild(newObject)
        return newObject;

    }
 
    callMethod(name, args) {
        for (let child of this.children) {
            child.callMethod(name, args);
        }
    }
}