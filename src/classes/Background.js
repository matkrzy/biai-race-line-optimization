export class Background {
  constructor() {}

  draw = view => {
    view.ctx.fillStyle = "#3C3";
    view.ctx.beginPath();
    view.ctx.rect(0, 0, view.canvas.width, view.canvas.height);
    view.ctx.fill();
  };
}
