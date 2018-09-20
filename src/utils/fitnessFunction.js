export const fitnessFunction = genotype => {
  const g = 9.80665;
  const points = genotype.racingLine.points;
  const vehicle = genotype.parameters.vehicle;

  const Cd = vehicle.dragCoefficient;
  const μ = vehicle.frictionCoefficient;
  const m = vehicle.weight;
  const ad = vehicle.deceleration;

  const velocities = [];

  //1. Calculate maximum possible velocity in accordance to curve radius
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const r = point.radius;
    let v = Math.sqrt(μ * g * r);

    var curr = points[i];
    var next = points[(i + 1) % points.length];
    velocities.push({
      point,
      v,
      vAfterRadiusClamp: v,
      distance: curr.getDistance(next)
    });
  }

  //2. Clamp maximum possisble velocity in accordance to acceleration
  let min = {
    i: 0,
    val: +Infinity
  };
  for (let i = 0; i < velocities.length; i++) {
    if (velocities[i].v < min.val) {
      min.i = i;
      min.val = velocities[i].v;
    }
  }
  for (let i = 0; i < velocities.length; i++) {
    const currIndex = velocities.length + i + min.i;
    const prevIndex = currIndex - 1;

    const curr = velocities[currIndex % velocities.length];
    const prev = velocities[prevIndex % velocities.length];

    const vprev = prev.v;
    const s = prev.distance;

    const F = vehicle.torque / (vehicle.wheelDiameter / 2);
    const Fd = -Cd * vprev * vprev;

    const a = (F + Fd) / m;
    const Δt = s / vprev;
    const Δv = a * Δt;

    curr.v = Math.min(curr.v, prev.v + Δv);
    curr.vAfterAccClamp = curr.v;
  }

  //3. Clamp maximum possisble velocity in accordance to deceleration
  min = {
    i: 0,
    val: +Infinity
  };
  for (let i = 0; i < velocities.length; i++) {
    if (velocities[i].v < min.val) {
      min.i = i;
      min.val = velocities[i].v;
    }
  }
  for (let i = 0; i < velocities.length; i++) {
    const currIndex = velocities.length - i + min.i;
    const nextIndex = currIndex + 1;

    const curr = velocities[currIndex % velocities.length];
    const next = velocities[nextIndex % velocities.length];

    const vnext = next.v;
    const s = curr.distance;

    const Fd = -Cd * vnext * vnext;

    const a = Fd / m + ad;
    const Δt = s / vnext;
    const Δv = a * Δt;

    curr.v = Math.min(curr.v, next.v - Δv);
    curr.vAfetrDecClamp = curr.v;
  }

  //4. Calculate lap time in accordance to velocity
  let t = 0.0;

  for (let i = 0; i < velocities.length; i++) {
      let Δt = 0;
      const curr = velocities[i];

      if (i > 0) {
        const prev = velocities[i - 1];

        const v = curr.v;
        const s = prev.distance;

        Δt = s / v;
      }

      t += Δt;

      curr.t = t;
      curr.Δt = Δt;
  }

  return t;
};
