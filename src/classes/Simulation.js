import { Population } from 'classes/Population';
import { RacingLine } from 'classes/RacingLine';
import { Track } from 'classes/Track';
import { Vehicle } from 'classes/Vehicle';
import { View } from 'classes/View';

export class Simulation {
  constructor(canvas, ctx) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._track = null;
    this._vehicle = null;
    this._population = null;
    this._generation = null;
    this._genotypes = null;
    this._racingLines = [];
    this._view = null;
  }

  fitnessFunction = genotype => {
    return 0;
  };

  setTrack = data => (this._track = new Track(data, this._canvas, this._ctx));

  getTrack = () => this._track;

  setVehicle = data => (this._vehicle = this.vehicle = new Vehicle(data));

  getVehicle = () => this._vehicle;

  setPopulation = (
    size = 20,
    mutationRatio = 0.005,
    crossingOverRatio = 1,
    fitnessFunction = this.fitnessFunction(),
    props = { track: this._track, vehicle: this._vehicle },
  ) => (this._population = new Population(size, mutationRatio, crossingOverRatio, fitnessFunction, props));

  getPopulation = () => this._population;

  setGeneration = (generation = 0) =>
    (this._generation = this._population.getGenerations()[generation]);

  getGeneration = () => this._generation;

  setGenotypes = () => (this._genotypes = this.generation.getGenotypes());

  getGenotypes = () => this._genotypes;

  setView = () => (this._view = new View(this._canvas));

  getView = () => this._view;

  applyGenotypesToRacingLines = () => {
    this._genotypes.forEach(genotype => {
      this._racingLines.push(new RacingLine(genotype, this._canvas, this._ctx));
    });
  };

  addObjectToView = object => this._view.addObject(object);

  applyRacingLinesToView = () => {
    this._racingLines.forEach(line => {
      this._view.addObject(line);
    });
  };
}
