import Component from "../Component.js"
import Circle from "../Geometry/Circle.js";
export default  class CircleGeometryComponent extends Component{
    constructor(gameObject, radius){
        super(gameObject);
        this.radius = radius;
    }
    asGeometry(){
        return new Circle(this.radius)
    }
}