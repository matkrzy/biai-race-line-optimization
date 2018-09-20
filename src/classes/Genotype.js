import { RacingLine } from "./RacingLine";

export class Genotype {
  constructor(genes, mutationRatio, crossingOverRatio, fitnessFunction, parameters) {
    this.genes = genes;
    this.mutationRatio = mutationRatio;
    this.crossingOverRatio = crossingOverRatio;
    this.fitness = {
      function: fitnessFunction,
      score: undefined
    };
    this.parameters = parameters;
    this.maximumAmplitude =
      this.parameters.track.width - this.parameters.vehicle.width;

    this.racingLine = new RacingLine(this);
  }

  getGenes = () => this.genes;

  getRacingLine = () => this.racingLine;

  getFitness = () => this.fitness;

  assessFitness = () => (this.fitness.score = this.fitness.function(this));

  reproduce = genotype => {
    let genesSet;

    if (Math.random() < this.crossingOverRatio) {
        const crossingOverPoint = Math.floor(Math.random() * genotype.genes.length);
        genesSet = [
            [
                ...genotype.genes.slice(0, crossingOverPoint),
                ...this.genes.slice(crossingOverPoint)
            ],
            [
                ...genotype.genes.slice(crossingOverPoint),
                ...this.genes.slice(0, crossingOverPoint)
            ]
        ];
    } else {
        genesSet = [
            [...this.genes],
            [...genotype.genes]
        ];
    }

    genesSet.forEach(genes => {
      for (let i = 0; i < genes.length; i++) {
        if (Math.random() < this.mutationRatio) {
          genes[i] = genes[i].withMutation();
        }
      }
    });

    return [
      new Genotype(
        [...genesSet[0]],
        this.mutationRatio,
        this.crossingOverRatio,
        this.fitness.function,
        this.parameters
      ),
      new Genotype(
        [...genesSet[1]],
        this.mutationRatio,
        this.crossingOverRatio,
        this.fitness.function,
        this.parameters
      )
    ];
  };
}
