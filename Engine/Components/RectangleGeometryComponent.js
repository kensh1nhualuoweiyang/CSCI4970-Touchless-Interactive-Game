import Component from "../Component.js"
import { Rectangle } from "../Geometry/EngineGeometry.js";
export default  class RectangleGeometryComponent extends Component{
    constructor(gameObject, width, height){
        super(gameObject);
        this.width = width;
        this.height = height;
    }
    asGeometry(){
        return new Rectangle(this.width, this.height);
    }
}