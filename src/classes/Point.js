export class Point {
  constructor(xy) {
    this.x = xy.x;
    this.y = xy.y;
  }

  getDistance = destination => {
    const Δx = destination.x - this.x;
    const Δy = destination.y - this.y;

    return Math.sqrt(Δx * Δx + Δy * Δy);
  };

  getBearing = destination => {
    const Δx = destination.x - this.x;
    const Δy = destination.y - this.y;

    return Math.atan2(Δy, Δx);
  };
}
