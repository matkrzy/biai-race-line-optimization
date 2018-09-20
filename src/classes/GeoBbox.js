import { GeoCoordinate } from "classes/GeoCoordinate";

export class GeoBbox {
  constructor() {
    this.coordinates = [
      new GeoCoordinate([undefined, undefined]),
      new GeoCoordinate([undefined, undefined]),
    ];
  }

  addCoordinate = coordinate => {
    if (
      coordinate.lng < this.coordinates[0].lng ||
      this.coordinates[0].lng === undefined
    ) {
      this.coordinates[0].lng = coordinate.lng;
    }
    if (
      coordinate.lng > this.coordinates[1].lng ||
      this.coordinates[1].lng === undefined
    ) {
      this.coordinates[1].lng = coordinate.lng;
    }
    if (
      coordinate.lat < this.coordinates[0].lat ||
      this.coordinates[0].lat === undefined
    ) {
      this.coordinates[0].lat = coordinate.lat;
    }
    if (
      coordinate.lat > this.coordinates[1].lat ||
      this.coordinates[1].lat === undefined
    ) {
      this.coordinates[1].lat = coordinate.lat;
    }
  };

  getTopLeft = () =>
    new GeoCoordinate([this.coordinates[0].lng, this.coordinates[1].lat]);

  getTopRight = () => this.coordinates[1];

  getBottomLeft = () => this.coordinates[0];

  getBottomRight = () =>
    new GeoCoordinate([this.coordinates[1].lng, this.coordinates[0].lat]);

  getCenter = () =>
    new GeoCoordinate([
      (this.coordinates[0].lng + this.coordinates[1].lng) / 2,
      (this.coordinates[0].lat + this.coordinates[1].lat) / 2,
    ]);

  getWidth = () =>
    Math.max(
      this.getTopLeft().getDistance(this.getTopRight()),
      this.getBottomLeft().getDistance(this.getBottomRight()),
    );

  getHeight = () =>
    Math.max(
      this.getTopLeft().getDistance(this.getBottomLeft()),
      this.getTopRight().getDistance(this.getBottomRight()),
    );
}
