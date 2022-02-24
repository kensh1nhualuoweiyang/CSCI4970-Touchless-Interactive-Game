import Scene from "./Scene.js"
import SceneManager from "./SceneManager.js"
import * as Engine from "./Components/EngineComponents.js"

/**
 * @class GameObject representing a game object in the scene
 */
export default class GameObject {

    static deserialize(gameObjectDefinition) { //Deserialize a game object definition
        let toReturn = new GameObject(); //Create a new Game Object
        toReturn.name = gameObjectDefinition.name; //Set the name (for later reference in the game)
        if (gameObjectDefinition.components)
            for (let componentDefinition of gameObjectDefinition.components) { //Loop over all the defined components
                let componentClass = SceneManager.allComponents.find(i => (new i()).constructor.name == componentDefinition.name); //Find a component definition with the appropriate name
                let component = new componentClass(toReturn, ...componentDefinition.args || []); //Create a new component, speading the arguments and defaulting to nothing.
                toReturn.components.push(component);
            }
        if (gameObjectDefinition.children)
            for (let childDefinition of gameObjectDefinition.children) {
                let child = Scene.deserializeObject(childDefinition);
                toReturn.addChild(child);
            }
        return toReturn;
    }

    /**
     * Set the default values of x and y
     */
    constructor(name) {
        this.name = name;
        //this.x = 0;
        //this.y = 0;
        this.components = [];
        //this.children = [];
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
    /**
     * Update the game by iterating over every game object and calling update if available.
     */
    update() {
        for (let component of this.components) {
            if (component.update) component.update();
        }
        for (let child of this.transform.children) {
            child.update();
        }
    }

    /**
     * Draw the game object
     * @param {2D Context from a Canvas} ctx where the game object is drawn
     */
    draw(layers) {//How does the game object draw itself?
        if(!this.enabled) return;
        let ctx = layers.find(l=>l.name == this.drawLayer).ctx
        ctx.save();
        ctx.translate(this.transform.position.x, this.transform.position.y);
        ctx.rotate(this.transform.rotation);
        ctx.scale(this.transform.scale.x, this.transform.scale.y)
        for (let component of this.components) {
            if (component.draw) component.draw(ctx);
        }
        for (let child of this.transform.children) {
            child.draw(layers);
        }
        ctx.restore();
    }

    /**
     * Mark this game object for destroy
     */
    destroy() {
        this.markedDestroy = true;
    }

    /**
     * Get a game object by name
     */
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

    /**
     * Find a component by name
     */
    getComponent(name) {
        for (let component of this.components) {
            if (component.constructor.name == name)
                return component;
        }
        //If we didn't find it, search any children we have
        // for(let child of this.transform.children){
        //     let component = child.getComponent(name);
        //     if(component) return component;
        // }
        return null;
    }

    /**
     * Call a method on this game object (if present) and all children
     */
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