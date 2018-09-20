export class View {
  constructor(canvas, ctx) {
    this.pan = {
      x: 0,
      y: 0
    };
    this.zoom = 1;
    this.objects = {};
    this.canvas = canvas;
    this.ctx = ctx;
  }

  getZoom = () => this.zoom;

  setZoom = zoom => (this.zoom = zoom);

  getPan = () => this.pan;

  setPan = pan => (this.pan = pan);

  fitToTrack = (track, margin) => {
    this.zoom = Math.min(
      (this.canvas.width - margin.x * 2) / track.bbox.getWidth(),
      (this.canvas.height - margin.y * 2) / track.bbox.getHeight()
    );
  };

  addObject = object => {
    const instance = object.constructor.name;
    if (!this.objects[instance]) {
      this.objects[instance] = [];
    }
    this.objects[instance].push(object);
  };

  removeObject = toRemove => {
    const instance = toRemove.constructor.name;
    this.objects[instance] = this.objects[instance].filter(
      object => toRemove !== object
    );
  };

  draw = () => {
    Object.values(this.objects).forEach(values => {
      values.forEach(object => {
        if (typeof object.draw === "function") {
          object.draw(this);
        }
      });
    });
  };
}
