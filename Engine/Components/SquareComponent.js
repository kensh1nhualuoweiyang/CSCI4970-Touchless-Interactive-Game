import Component from "../Component.js"
import Square from "../GeometryObject/Square.js"
export default  class SquareComponent extends Component{
    constructor(gameObject, dimension){
        super(gameObject);
        this.dimension = dimension;   
    }

    asGeometry(){
        return new Square(this.gameObject.transform.position.x,this.gameObject.transform.position.y,this.dimension,this.dimension);
    }

}