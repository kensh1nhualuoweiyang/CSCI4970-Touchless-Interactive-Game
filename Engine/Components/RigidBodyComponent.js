import Component from "../Component.js"


export default class RigidBodyComponent extends Component {
  constructor(gameObject, args) {
    super(gameObject);
    this.gravity = true;
    if (args) {
      this.gravity = args.gravity;
    }
  }
  start() {
    this.heading = 0;
    this.velocity = 0;
  }
  update() {
    let vx = Math.cos(this.heading) * this.velocity
    let vy = Math.sin(this.heading) * this.velocity

    if (this.gravity)
      vy += 32 / 60 //32 ft^2/fps
    this.heading = Math.atan2(vy, vx);
    this.velocity = Math.sqrt(vx ** 2 + vy ** 2)

    this.gameObject.transform.position.x += vx * 1 / 60
    this.gameObject.transform.position.y += vy / 60
  }

}