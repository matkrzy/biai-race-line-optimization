import { Point } from "./Point";
import { getRadius } from "utils/getRadius";

export class RacingLine {
  constructor(genotype) {
    this.track = genotype.parameters.track;
    this.vehicle = genotype.parameters.vehicle;
    this.genotype = genotype;
    this.points = [];

    this.pointRadius = undefined;
    this.drawTrackAxis = true;
    this.trackAxisPointRadius = 1.0;
    this.drawPointNormalRange = false;
    this.drawPointNormal = true;

    this.genotype.genes.forEach((_gene, i) => {
      const axisPoint = this.track.axisPoints[i];
      const gene = (_gene.getOffset() - 0.5) * this.genotype.maximumAmplitude;
      const normaldx = Math.sin(axisPoint.bearing) * gene;
      const normaldy = Math.cos(axisPoint.bearing) * gene;

      this.points.push(
        new Point({
          x: axisPoint.x + normaldx,
          y: axisPoint.y - normaldy
        })
      );
    });

    for (let i = 0; i < this.points.length; i++) {
        var point = this.points[i];
        var prevPoint = this.points[i === 0 ? this.points.length - 1 : i - 1];
        var nextPoint = this.points[i + 1 === this.points.length ? 0 : i + 1];

        point.bearing = prevPoint.getBearing(nextPoint);
        point.radius = getRadius(prevPoint, point, nextPoint);
    }
  }

  draw = view => {
    const axisPixels = this.track.axisPoints.map(axisPoint => ({
      x:
        view.canvas.width / 2 +
        (axisPoint.x - view.getPan().x) * view.getZoom(),
      y:
        view.canvas.height / 2 -
        (axisPoint.y - view.getPan().y) * view.getZoom(),
      bearing: axisPoint.bearing
    }));

    const pixels = this.points.map(point => ({
      x: view.canvas.width / 2 + (point.x - view.getPan().x) * view.getZoom(),
      y: view.canvas.height / 2 - (point.y - view.getPan().y) * view.getZoom(),
      bearing: point.bearing
    }));

    if (this.drawTrackAxis) {
      view.ctx.strokeStyle = "#AAA";
      view.ctx.lineWidth = 1;
      view.ctx.beginPath();
      view.ctx.moveTo(axisPixels[0].x, axisPixels[0].y);

      axisPixels.forEach(axisPixel =>
        view.ctx.lineTo(axisPixel.x, axisPixel.y)
      );

      view.ctx.lineTo(axisPixels[0].x, axisPixels[0].y);
      view.ctx.stroke();
    }

    if (
      typeof this.trackAxisPointRadius !== "undefined" &&
      this.trackAxisPointRadius > 0
    ) {
      view.ctx.strokeStyle = "#00C";
      view.ctx.lineWidth = 1;

      axisPixels.forEach(axisPixel => {
        view.ctx.beginPath();
        view.ctx.arc(
          axisPixel.x,
          axisPixel.y,
          this.trackAxisPointRadius * view.getZoom(),
          0,
          2 * Math.PI
        );
        view.ctx.stroke();
      });
    }

    if (this.drawPointNormalRange) {
      view.ctx.strokeStyle = "#79A";
      view.ctx.lineWidth = 1;

      axisPixels.forEach(axisPixel => {
        const normaldx =
          ((Math.sin(axisPixel.bearing) * this.genotype.maximumAmplitude) / 2) *
          view.getZoom();
        const normaldy =
          ((Math.cos(axisPixel.bearing) * this.genotype.maximumAmplitude) / 2) *
          view.getZoom();

        view.ctx.beginPath();
        view.ctx.moveTo(axisPixel.x - normaldx, axisPixel.y - normaldy);
        view.ctx.lineTo(axisPixel.x + normaldx, axisPixel.y + normaldy);
        view.ctx.stroke();
      });
    }

    if (this.drawPointNormal) {
      view.ctx.strokeStyle = "#00F";
      view.ctx.lineWidth = 1;

      axisPixels.forEach((axisPixel, i) => {
        const pixel = pixels[i];

        view.ctx.beginPath();
        view.ctx.moveTo(axisPixel.x, axisPixel.y);
        view.ctx.lineTo(pixel.x, pixel.y);
        view.ctx.stroke();
      });
    }

    view.ctx.strokeStyle = "#F00";
    view.ctx.lineWidth = this.vehicle.width * view.getZoom();
    view.ctx.beginPath();
    view.ctx.moveTo(pixels[0].x, pixels[0].y);

    pixels.forEach((pixel, i) => {
      if (i === 0) {
        return;
      }

      const handledx1 =
        ((Math.sin(axisPixels[i - 1].bearing + 0.5 * Math.PI) *
          this.track.axisPointInterval) /
          2) *
        view.getZoom();

      const handledy1 =
        ((Math.cos(axisPixels[i - 1].bearing + 0.5 * Math.PI) *
          this.track.axisPointInterval) /
          2) *
        view.getZoom();

      const handledx2 =
        ((Math.sin(axisPixels[i].bearing - 0.5 * Math.PI) *
          this.track.axisPointInterval) /
          2) *
        view.getZoom();

      const handledy2 =
        ((Math.cos(axisPixels[i].bearing - 0.5 * Math.PI) *
          this.track.axisPointInterval) /
          2) *
        view.getZoom();

      const cp1 = {
        x: pixels[i - 1].x + handledx1,
        y: pixels[i - 1].y + handledy1
      };

      const cp2 = {
        x: pixel.x + handledx2,
        y: pixel.y + handledy2
      };

      view.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pixel.x, pixel.y);
    });

    view.ctx.lineTo(pixels[0].x, pixels[0].y);
    view.ctx.stroke();

    if (typeof this.pointRadius !== "undefined" && this.pointRadius > 0) {
      view.ctx.fillStyle = "#F00";

      pixels.forEach(pixel => {
        view.ctx.beginPath();
        view.ctx.arc(pixel.x, pixel.y, this.pointRadius, 0, 2 * Math.PI);
        view.ctx.fill();
      });
    }
  };
}
