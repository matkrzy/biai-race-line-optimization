import { Genotype } from "./Genotype";
import { Gene } from "./Gene";

export class Generation {
  constructor(generation) {
    if (typeof generation === "undefined") {
      this.genotypes = [];
      this.fitnessFunction = undefined;
      this.number = 0;
      this.parameters = {};
    } else {
      this.genotypes = [];
      this.fitnessFunction = generation.fitnessFunction;
      this.number = generation.number + 1;
      this.parameters = generation.parameters;

      const selectedGenotypePairs = generation.select();
      selectedGenotypePairs.forEach(genotypePair => {
        const offspring = genotypePair[0].reproduce(genotypePair[1]);
        this.genotypes.push(...offspring);
      });
    }
  }

  setFitnessFunction = fitnessFunction =>
    (this.fitnessFunction = fitnessFunction);

  setGenerationNumber = number => (this.number = number);

  setMutationRatio = mutationRatio => (this.mutationRatio = mutationRatio);

  setCrossingOverRatio = crossingOverRatio => (this.crossingOverRatio = crossingOverRatio);

  setParameters = parameters => (this.parameters = parameters);

  getGenotypes = () => this.genotypes;

  getGenotype = index => this.genotypes[index];

  createRandomGenotype = () => {
    const genes = [];

    for (let i = 0; i < this.parameters.track.axisPoints.length; i++) {
      genes.push(new Gene());
    }

    return new Genotype(genes, this.mutationRatio, this.crossingOverRatio, this.fitnessFunction, this.parameters);
  };

  assessFitness = () => this.genotypes.forEach(item => item.assessFitness());

  select = function() {
    let selectedGenotypes =
      [...this.genotypes]
      .sort(
        (a, b) =>
          a.fitness.score > b.fitness.score
            ? 1
            : a.fitness.score < b.fitness.score
              ? -1
              : 0
      );

    const genotypePairs = [];

    for (let i = 0; i < this.genotypes.length / 2; i++) {
      let a = Math.random();
      let b = Math.random();

      let index1 = Math.floor(Math.pow(a, 3) * this.genotypes.length);
      let index2 = Math.floor(Math.pow(b, 3) * (this.genotypes.length - 1));
      if (index2 >= index1) {
          index2++;
      }

      genotypePairs.push([
        selectedGenotypes[index1],
        selectedGenotypes[index2]
      ]);
    }

    return genotypePairs;
  };
}
