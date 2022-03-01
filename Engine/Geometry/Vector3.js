import Vector  from "./Vector.js";

export default class Vector3{
  x;
  y;
  z;

  static get Zero(){
    return new Vector3(0,0,0);
  }

  static get ZeroW(){
    return new Vector3(0,0,1);
  }

  constructor(one, two, three){
  
    if(arguments.length == 0){
      this.x = 0; 
      this.y = 0;
      this.z = 0;
      return;
    }
    if(arguments.length == 1){
      if(Array.isArray(one)){
        if(one.length <= 1){
          //Bad array length
          console.error("If you pass an array in as the Vector2 constructor, it must have at least two values")
          return;
        }
        this.x = one[0];
        this.y = one[1];
        this.z = one[2];
        return;
      }
      else{
        if((!one.x && one.x != 0) || (!one.y && one.y != 0) || (!one.z && one.z != 0)){
          console.error("If you pass a non-array as a single arguments to the Vector3 constructor, it must have 'x' and 'y' and 'z' keys")
          return;
        }
        this.x = one.x;
        this.y = one.y;
        this.z = one.z;
        return;
      }      
    }
    if(arguments.length == 3){
      this.x = one;
      this.y = two;
      this.z = three;
    }
  }

  static plus(one, two){
    return new Vector(one.x + two.x, one.y+two.y, one.z + two.z);
  }
  static minus(one, two){
    return new Vector(one.x - two.x, one.y - two.y, one.z - two.z);
  }
  static scale(one, scalar){
    return new Vector(one.x * scalar, one.y * scalar, one.z * scalar);
  }

  plus(other){
    this.x += other.x;
    this.y += other.y;
  }
  minus(other){
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }
  scale(scalar){
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar
  }

  length(){
    return Math.sqrt(this.lengthSquared())
  }
  lengthSquared(){
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  static normalize(vector3){
    let toReturn = new Vector3(vector3);
    toReturn.normalize();
    return toReturn;
  }

  normalize(){
    let length = this.getLength;
    this.x /= length;
    this.y /= length;
    this.z /= length;
  }

  static equals(one, two){
    return one.x == two.x && one.y == two.y && one.z == two.z;
  }

  equals(other){
    return Vector.equals(this, other);
  }
  static fromVector2(vector2){
    return new Vector3(vector2.x, vector2.y, 1);
  }
  asArray(){
    return [this.x,this.y,this.z]
  }
  asVector2(){
    return new Vector(this.x, this.y);
  }
  at(i){
    return this.asArray()[i];
  }
  setAt(i, value){
    if(i == 0)
      this.x = value;
    else if(i == 1)
      this.y = value;
    else if(i == 2)
      this.z = value;
    else
      throw "Bad index in Vector3";
    return this;
  }
  get w(){
    return this.z;
  }
  set w(value){
    this.z = value;
  }
}