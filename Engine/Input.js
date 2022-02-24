import SceneManager from "./SceneManager.js";
import Scene from "./Scene.js";
import Vector from "./Geometry/Vector.js"

export default class Input {
  static keys = [];
  static keysDown = [];
  static keysUp = [];
  static frameKeysDown = [];
  static frameKeysUp = [];

  static mouseButtons = [];
  static mouseButtonsDown = [];
  static mouseButtonsUp = [];
  static frameMouseButtonsDown = [];
  static frameMouseButtonUp = [];

  static mousePosition = new Vector();
  static frameMousePosition;
  static lastFrameMousePosition;

  static scrollWheel = 0;
  static frameScrollWheel = 0;

  static SwapArrays() {
    this.frameKeysDown = this.keysDown;
    this.frameKeysUp = this.keysUp;
    this.keysDown = [];
    this.keysUp = [];

    this.frameMouseButtonsDown = this.mouseButtonsDown;
    this.frameMouseButtonsUp = this.mouseButtonsUp;
    this.mouseButtonsDown = [];
    this.mouseButtonsUp = [];

    this.lastFrameMousePosition = this.frameMousePosition
    //console.log(this.lastFrameMousePosition);
    this.frameMousePosition = new Vector(this.mousePosition);
    if(this.Remap)
      this.frameMousePosition = this.Remap(new Vector(this.mousePosition));

    this.frameScrollWheel = this.scrollWheel;
    this.scrollWheel = 0;

    if (Object.keys(this.frameKeysDown).length > 0) SceneManager.currentScene.callMethod("onKeyDown", this.frameKeysDown);
    if (Object.keys(this.frameKeysUp).length > 0) SceneManager.currentScene.callMethod("onKeyUp", this.frameKeysUp);
    if (Object.keys(this.frameMouseButtonsDown).length > 0) SceneManager.currentScene.callMethod("onMouseButtonDown", {buttons:this.frameMouseButtonsDown, location:this.frameMousePosition});
    if (Object.keys(this.frameMouseButtonsUp).length > 0) SceneManager.currentScene.callMethod("onMouseButtonUp", {buttons:this.frameMouseButtonsUp, location:this.frameMousePosition});
    if (this.frameScrollWheel != 0) SceneManager.currentScene.callMethod("onScrollWheel", this.frameScrollWheel);

    if (this.frameMousePosition && this.lastFrameMousePosition && !this.lastFrameMousePosition.equals(this.frameMousePosition))
      SceneManager.currentScene.callMethod("onMouseMove", this.frameMousePosition);
  }

  static getKey(key) {
    return this.keys[key];
  }
  static getKeyDown(key) {
    return this.frameKeysDown[key];
  }
  static getKeyUp(key) {
    return this.frameKeysUp[key];
  }

  static getMouseButton(button) {
    return this.mouseButtons[button];
  }
  static getMouseButtonDown(button) {
    return this.frameMouseButtonsDown[button];
  }
  static getMouseButtonUp(button) {
    return this.frameMouseButtonsUp[button];
  }

  static getScrollWheel() {
    return this.frameScrollWheel;
  }

  static getMousePosition() {
    return this.frameMousePosition;
  }
  static getMousePositionDelta() {
    return Vector.subtract(this.frameMousePosition, this.lastFrameMousePosition);
  }


  static attach(document) {
    //Setup all the key listeners
    document.body.addEventListener('keydown', keydown);
    document.body.addEventListener('keyup', keyup);
    document.body.addEventListener('keypress', keypress);
    document.body.addEventListener('mousedown', mousedown);
    document.body.addEventListener('mouseup', mouseup);
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('wheel', wheelevent);
    document.body.addEventListener('contextmenu', contextmenu);

    function keydown(event) {
      //console.log("Down: " + event.key);
      if (Input.keys[event.key] != true)
        Input.keysDown[event.key] = true;
      Input.keys[event.key] = true;
    }

    function keyup(event) {
      //console.log("Up: " + event.key)
      if (Input.keys[event.key] != false)
        Input.keysUp[event.key] = true;
      Input.keys[event.key] = false;
    }

    function mousedown(event) {
      //console.log("Mouse Down: " + event.button)
      if (Input.mouseButtons["" + event.button] != true)
        Input.mouseButtonsDown["" + event.button] = true;
      Input.mouseButtons["" + event.button] = true;
    }

    function mouseup(event) {
      //console.log("Mouse Up: " + event.button)
      if (Input.mouseButtons[event.button] != false)
        Input.mouseButtonsUp[event.button] = true;
      Input.mouseButtons[event.button] = false;
    }

    function mousemove(event) {
      //console.log("Mouse Move: " + event.clientX + ", " + event.clientY)
      Input.mousePosition.x = event.clientX;
      Input.mousePosition.y = event.clientY;
    }

    function wheelevent(event) {
      //console.log("Scroll Delta: " + event.deltaY)
      if (event.deltaY != 0)
        Input.mouseScrollDelta = event.deltaY;
    }

    function keypress(event) {
      //console.log(`Keys: ${event.key}, Modifier keys: Control: ${event.ctrlKey}, Alt: ${event.altKey}, Shift: ${event.shiftKey}, Meta Key: ${event.metaKey}`);
    }


    function contextmenu(event) {
      if (event.preventDefault != undefined)
        event.preventDefault();
      if (event.stopPropagation != undefined)
        event.stopPropagation();
      return false;
    }
  }
}