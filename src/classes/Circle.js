export class Circle {
  constructor({ x, y, radius }) {
    this.x = x;
    this.y = y;
    this.r = radius;
  }

  draw = view => {
    view.ctx.strokeStyle = "#FFF";
    view.ctx.lineWidth = 1;

    const x =
      view.canvas.width / 2 + (this.x - view.getPan().x) * view.getZoom();
    const y =
      view.canvas.height / 2 - (this.y - view.getPan().y) * view.getZoom();
    const r = this.r * view.getZoom();

    view.ctx.beginPath();
    view.ctx.arc(x, y, r, 0, 2 * Math.PI);
    view.ctx.stroke();
  };
}
