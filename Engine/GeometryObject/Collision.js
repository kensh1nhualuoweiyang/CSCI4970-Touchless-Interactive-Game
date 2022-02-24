import Circle from "./Circle.js"
import Square from "./Square.js"
import Point from "./Vector.js"
import Rectangle from "./Rectangle.js";

export default class{
    static collisionDect(one,two){
        if(one instanceof Point){
            if(two instanceof Square || two instanceof Rectangle){
                return one.x >= two.x && one.y >= two.y && one.x <= two.x + two.width && one.y <= two.y + two.height;
            }
            if(two instanceof Circle){
                let distance = one.distanceTo(new Point(two.x, two.y));
                if(distance < two.radius)
                  return true;
                return false;
            }
        }
        if(one instanceof Circle){
            if(two instanceof Square || two instanceof Rectangle){
                let objects = [];
                objects.push(new Circle(two.x, two.y, one.radius))
                objects.push(new Circle(two.x + two.width, two.y, one.radius))
                objects.push(new Circle(two.x+ two.width, two.y + two.height, one.radius))
                objects.push(new Circle(two.x, two.y + two.height, one.radius))
                objects.push(new Square(two.x - one.radius, two.y, two.width + one.radius * 2, two.height))
                objects.push(new Square(two.x , two.y - one.radius, two.width , two.height+ one.radius * 2)) 
              
                for(let object of objects){
                    if(this.inCollision(new Point(one.x, one.y), object)){
                    
                      return true;
                    }
                  }
                  return false;
            }
        }
        if(one instanceof Square || one instanceof Rectangle){
            if(two instanceof Circle){
                return this.collisionDect(two,one);
            }
            if(two instanceof Square || two instanceof Rectangle){
                let left = one.x;
                let right = one.x + one.width;
                let bottom = one.y;
                let top = one.y+one.height;
                if(two.x > right)
                    return false;
                if(two.x + two.width < left)
                    return false;
                if(two.y > top)
                    return false;
                if(two.y+two.height < bottom)
                    return false;
                return true;
            }
            
        }
       
    }
}