import { Point } from "classes/Point";

export class GeoCoordinate {
  constructor(lnglat) {
    this.R = 6371000;

    this.lng = lnglat[0];
    this.lat = lnglat[1];
  }

  getLatAsDeg = () => this.lat;

  getLngAsDeg = () => this.lng;

  getLatAsRad = () => this.lat * Math.PI / 180;

  getLngAsRad = () => this.lng * Math.PI / 180;

  getDistance = destination => {
    const φ1 = this.getLatAsRad();
    const φ2 = destination.getLatAsRad();
    const λ1 = this.getLngAsRad();
    const λ2 = destination.getLngAsRad();

    const Δφ = φ2 - φ1;
    let Δλ = λ2 - λ1;

    const Δψ = Math.log(
      Math.tan(Math.PI / 4 + φ2 / 2) / Math.tan(Math.PI / 4 + φ1 / 2),
    );
    const q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Math.abs(Δλ) > Math.PI)
      Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : 2 * Math.PI + Δλ;

    return Math.sqrt(Δφ * Δφ + q * q * Δλ * Δλ) * this.R;
  };

  getAsPoint = center => {
    if (typeof center === 'undefined') {
      center = new GeoCoordinate([0, 0]);
    }

    const _1_k = Math.cos(center.getLatAsRad());

    function transformLat(lat) {
      return Math.log(Math.tan(Math.PI / 4 + lat / 2));
    }

    return new Point({
      x: (this.getLngAsRad() - center.getLngAsRad()) * _1_k * this.R,
      y:
        (transformLat(this.getLatAsRad()) -
          transformLat(center.getLatAsRad())) *
        _1_k *
        this.R,
    });
  };
}
