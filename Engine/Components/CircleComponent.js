import Component from "../Component.js"
import Circle from "../GeometryObject/Circle.js";
export default  class CircleComponent extends Component{
    constructor(gameObject, radius){
        super(gameObject);
        this.radius = radius;
    }
    asGeometry(){
        return new Circle(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.radius)
    }
}