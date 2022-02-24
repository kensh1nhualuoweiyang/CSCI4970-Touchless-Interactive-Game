import Component from "../Component.js"
export default class DrawGeometryComponent extends Component {
  constructor(gameObject, fillColor, strokeColor = null, strokeWidth=1) {
    super(gameObject);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
  draw(ctx) {
    ctx.lineWidth = this.strokeWidth;
    let rectangleGeometry = this.gameObject.getComponent("RectangleComponent")
    if (rectangleGeometry) {
      if (this.fillColor) {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(0 - rectangleGeometry.width / 2, 0 - rectangleGeometry.height / 2, rectangleGeometry.width, rectangleGeometry.height);
      }
      if(this.strokeColor){
        ctx.strokeStyle = this.strokeColor;
        ctx.strokeRect(0 - rectangleGeometry.width / 2, 0 - rectangleGeometry.height / 2, rectangleGeometry.width, rectangleGeometry.height);
      }
    }
    let circleGeometry = this.gameObject.getComponent("CircleComponent");
    if (circleGeometry) {
      
      ctx.beginPath();
      ctx.arc(0, 0, circleGeometry.radius, 0, Math.PI * 2);
      if (this.fillColor) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
      }
      if(this.strokeColor){
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
      }
    }
    let Square = this.gameObject.getComponent("SquareComponent");
    if (Square) {
      if (this.fillColor) {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.gameObject.transform.position.x - Square.dimension / 2, this.gameObject.transform.position.y - Square.dimension / 2, Square.dimension, Square.dimension);
      }
    }

  }
}