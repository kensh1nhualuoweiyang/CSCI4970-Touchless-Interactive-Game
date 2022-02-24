import Component from "../Component.js"
import Rectangle from "../GeometryObject/Rectangle.js";
export default  class RectangleComponent extends Component{
    constructor(gameObject, width, height){
        super(gameObject);
        this.width = width;
        this.height = height;
    }

    asGeometry(){
        return new Rectangle(this.gameObject.transform.position.x,this.gameObject.transform.position.y,this.width,this.height);
    }
}