import Component from "../Component.js"
export default  class PolygonGeometryComponent extends Component{
    constructor(gameObject, points){
        super(gameObject);
        this.points = points;
    }
}