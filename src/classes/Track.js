import { GeoBbox } from 'classes/GeoBbox';
import { GeoCoordinate } from 'classes/GeoCoordinate';
import { Point } from 'classes/Point';
import {getRadius} from "../utils/getRadius";

const defaultValues = {
    width: 15
};

export class Track {
  constructor(geojson, data = defaultValues) {
    this.geojson = geojson;
    this.width = data.width;
    this.markingWidth = 0.2;
    this.axisPointInterval = this.width; //Sensible default, can be changed
    this.bbox = new GeoBbox();
    this.coordinates = [];
    this.points = [];
    this.axisPoints = [];

    this.geojson.features.forEach(feature => {
      const { geometry: { coordinates } } = feature;

      coordinates.forEach(cord => {
        cord = new GeoCoordinate(cord);
        cord.properties = feature.properties;

        this.coordinates.push(cord);
        this.bbox.addCoordinate(cord);
      });
    });

    this.coordinates.forEach(cord => {
      const point = cord.getAsPoint(this.bbox.getCenter());

      this.points.push(point);
    });

    let lengthTravelled = 0;
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      var pointNext =
        i + 1 === this.points.length ? this.points[0] : this.points[i + 1];

      var Δx = pointNext.x - point.x;
      var Δy = pointNext.y - point.y;

      var segmentLength = point.getDistance(pointNext);
      var segmentLengthTravelled = 0;

      var axisPoint;

      if (i === 0) {
        axisPoint = {...point};
        this.axisPoints.push(axisPoint);
      }

      var carryLength = lengthTravelled % this.axisPointInterval;
      while (
        carryLength + (segmentLength - segmentLengthTravelled) >=
        this.axisPointInterval
      ) {
        segmentLengthTravelled += this.axisPointInterval - carryLength;
        carryLength = 0;

        if (segmentLengthTravelled / segmentLength > 1) {
        }

        axisPoint = new Point({
          x: point.x + Δx * (segmentLengthTravelled / segmentLength),
          y: point.y + Δy * (segmentLengthTravelled / segmentLength),
        });
        this.axisPoints.push(axisPoint);
      }

      lengthTravelled += segmentLength;
    }

    for (let i = 0; i < this.points.length; i++) {
        var point = this.points[i];
        var prevPoint = this.points[i === 0 ? this.points.length - 1 : i - 1];
        var nextPoint = this.points[i + 1 === this.points.length ? 0 : i + 1];

        point.bearing = prevPoint.getBearing(nextPoint);
        point.radius = getRadius(prevPoint, point, nextPoint);
    }

    for (let i = 0; i < this.axisPoints.length; i++) {
      axisPoint = this.axisPoints[i];
      var prevAxisPoint = this.axisPoints[i === 0 ? this.axisPoints.length - 1 : i - 1];
      var nextAxisPoint = this.axisPoints[i + 1 === this.axisPoints.length ? 0 : i + 1];

      axisPoint.bearing = prevAxisPoint.getBearing(nextAxisPoint);
      axisPoint.radius = getRadius(prevAxisPoint, axisPoint, nextAxisPoint);
    }
  }

  draw = view => {
    var i;
    var pixels = [];

    for (i = 0; i < this.points.length; i++) {
      var point = this.points[i];
      var pixel = {
        x: view.canvas.width / 2 + (point.x - view.getPan().x) * view.getZoom(),
        y: view.canvas.height / 2 - (point.y - view.getPan().y) * view.getZoom(),
      };

      pixels.push(pixel);
    }

    view.ctx.strokeStyle = '#FFF';
    view.ctx.lineWidth = this.width * view.getZoom();
    view.ctx.beginPath();
    view.ctx.moveTo(pixels[0].x, pixels[0].y);
    for (i = 1; i < pixels.length; i++) {
      pixel = pixels[i];
      view.ctx.lineTo(pixel.x, pixel.y);
    }
    view.ctx.lineTo(pixels[0].x, pixels[0].y);
    view.ctx.stroke();

    view.ctx.strokeStyle = '#777';
    view.ctx.lineWidth = (this.width - this.markingWidth * 2) * view.getZoom();
    view.ctx.beginPath();
    view.ctx.moveTo(pixels[0].x, pixels[0].y);
    for (i = 1; i < pixels.length; i++) {
      pixel = pixels[i];
      view.ctx.lineTo(pixel.x, pixel.y);
    }
    view.ctx.lineTo(pixels[0].x, pixels[0].y);
    view.ctx.stroke();
  };
}
