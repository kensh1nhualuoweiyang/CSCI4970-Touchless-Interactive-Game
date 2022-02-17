import Scene from "./scene.js"
import SceneManager from "./scene-manager.js"
import * as Engine from "./components/engine-components.js"

/**
 * @class GameObject representing a game object in the scene
 */
export default class GameObject {

    static deserialize(gameObjectDefinition) { 
        let toReturn = new GameObject(); 
        toReturn.name = gameObjectDefinition.name; 
        if (gameObjectDefinition.components)
            for (let componentDefinition of gameObjectDefinition.components) { 
                let componentClass = SceneManager.allComponents.find(i => (new i()).constructor.name == componentDefinition.name); 
                let component = new componentClass(toReturn, ...componentDefinition.args || []); 
                toReturn.components.push(component);
            }
        if (gameObjectDefinition.children)
            for (let childDefinition of gameObjectDefinition.children) {
                let child = Scene.deserializeObject(childDefinition);
                toReturn.addChild(child);
            }
        return toReturn;
    }


    constructor(name) {
        this.name = name;
        this.components = [];
        this.markedDestroy = false;
        this.components.push(new Engine.TransformComponent(this))
        this._enabled = true;
        this._awoken = false;
        this.drawLayer = "default"
    }
    get enabled(){
        return this._enabled;
    }
    enable(deep = true){
        this._enable(deep);
    }
    disable(deep = true){
        this._disable(deep);
    }
    awake(deep = true){
        if(this._awoken) return;
        this._awoken = true;
        for (let component of this.components) {
            if (component.awake) component.awake();
        }
        if (deep) {
            for (let child of this.transform.children) {
                child.awake(deep);
            }
        }
    }
    
    _enable(deep = true) {
        this._enabled = true;
        this.awake(deep);
        for (let component of this.components) {
            if (component.onEnable) component.onEnable();
        }
        if (deep) {
            for (let child of this.transform.children) {
                child._enable(deep);
            }
        }

    }
    _disable(deep = true) {
        this._enabled = false;
        for (let component of this.components) {
            if (component.onDisable) component.onDisable();
        }
        if (deep) {
            for (let child of this.transform.children) {
                child._disable(deep);
            }
        }
    }

    addChild(gameObject){
        this.transform.children.push(gameObject);
        gameObject.transform.parent = this.transform;
    }

    update() {
        for (let component of this.components) {
            if (component.update) component.update();
        }
        for (let child of this.transform.children) {
            child.update();
        }
    }

  
    draw(layers) {
        if(!this.enabled) return;
        for (let layer of layers) {    
            let ctx = layer.ctx
            ctx.save();
            ctx.translate(this.transform.position.x, this.transform.position.y);
            ctx.rotate(this.transform.rotation);
            ctx.scale(this.transform.scale.x, this.transform.scale.y)
        }
        let ctx = layers.find(l=>l.name == this.drawLayer).ctx
        for (let component of this.components) {
            if (component.draw) 
                component.draw(ctx);
        }
        for (let child of this.transform.children) {
            child.draw(layers);
        }
        for (let layer of layers) {
            layer.ctx.restore();
        }
    }


    destroy() {
        this.markedDestroy = true;
    }

 
    getGameObject(name) {
        for (let child of this.transform.children) {
            if (child.name == name) return child;
            let foundChild = child.getGameObject(name);
            if (foundChild) return foundChild;
        }
        return null;

    }

    static Find(string){
        return SceneManager.currentScene.getGameObject(string);
    }


    getComponent(name) {
        for (let component of this.components) {
            if (component.constructor.name == name)
                return component;
        }
        for(let child of this.transform.children){
            let component = child.getComponent(name);
            if(component) 
                return component;
        }
        return null;
    }


    callMethod(name, args) {
        if(!this.enabled) return
        for (let component of this.components) {
            if (component[name] && component.enabled)
                component[name](args);
        }
        for (let child of this.transform.children) {
            child.callMethod(name, args);
        }
    }

    get transform() {
        return this.components[0];
    }
}