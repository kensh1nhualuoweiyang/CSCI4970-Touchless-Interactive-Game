import Geometry from "./Collisions.js"
import Vector from "./Vector.js";
export default class Rectangle{
  constructor(width, height){
    this.width = width;
    this.height = height
   
  }
  get corners(){
    return [
      new Vector(-this.width/2, -this.height/2),
      new Vector(-this.width/2, this.height/2),
      new Vector(this.width/2, this.height/2),
      new Vector(this.width/2, -this.height/2),
    ]
  }

}