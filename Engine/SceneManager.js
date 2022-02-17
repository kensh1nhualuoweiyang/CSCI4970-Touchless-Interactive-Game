import Scene from "./Scene.js"

export default  class SceneManager {

  static currentScene;
  static allComponents;
  static allPrefabs;

  static allScenes = [];
  static changeScene(sceneName) {
    let proposedScene = SceneManager.allScenes.find(i => i.name == sceneName);
    if (!sceneName) 
        return console.error("Could now find a scene with the name of " + sceneName);
    if (SceneManager.currentScene && proposedScene.name == SceneManager.currentScene.name) 
        return console.log("Trying to change to the current scene " + sceneName)
    let scene = Scene.deserialize(proposedScene, true);  //Deserialize the scene definition
    SceneManager.currentScene = scene;
    for(let gameObject of SceneManager.currentScene.children){
      if(!gameObject.enabled) 
        continue;
      gameObject.awake();
      gameObject.enable(true);
    }
    scene.callMethod("start")
  }
}