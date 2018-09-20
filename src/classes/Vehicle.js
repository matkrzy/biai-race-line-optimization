const defaultValues = {
  width: 2,
  weight: 500,
  torque: 500,
  dragCoefficient: 0.8,
  frictionCoefficient: 1.5,
  deceleration: -30,
  wheelDiameter: 0.66
};

export class Vehicle {
  constructor(data = defaultValues) {
    this.width = data.width;
    this.weight = data.weight;
    this.torque = data.torque;
    this.dragCoefficient = data.dragCoefficient;
    this.frictionCoefficient = data.frictionCoefficient;
    this.deceleration = data.deceleration;
    this.wheelDiameter = data.wheelDiameter;
  }
}
