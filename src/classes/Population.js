import { Generation } from "./Generation";

export class Population {
  constructor(
    generationSize,
    mutationRatio,
    crossingOverRatio,
    fitnessFunction,
    parameters
  ) {
    this.generationSize = +generationSize;
    this.mutationRatio = +mutationRatio;
    this.crossingOverRatio = +crossingOverRatio;
    this.fitnessFunction = fitnessFunction;
    this.generations = [];
    this.parameters = parameters;

    this.generations.push(this.createRandomGeneration());
  }

  getGenerations = () => this.generations;

  getGeneration = index => {
    if (index < this.generations.length) {
      return this.generations[index];
    } else {
      console.error("index is out of range!");
    }
  };

  createRandomGeneration = () => {
    const generation = new Generation();

    generation.setFitnessFunction(this.fitnessFunction);
    generation.setGenerationNumber(0);
    generation.setMutationRatio(this.mutationRatio);
    generation.setCrossingOverRatio(this.crossingOverRatio);
    generation.setParameters(this.parameters);

    const genotypes = new Array(this.generationSize)
      .fill(null)
      .map(generation.createRandomGenotype);

    generation.genotypes = genotypes;

    generation.assessFitness();

    return generation;
  };

  getLastGeneration = () => {
    return this.generations[this.generations.length - 1];
  };

  evolve = () => {
    const lastGeneration = this.getLastGeneration();

    const newGeneration = new Generation(lastGeneration);
    newGeneration.assessFitness();

    this.generations.push(newGeneration);
  };

  canBeImproved = () => {
    const checkRecentGenerationsCount = 10;
    const maxGenerationsCount = 1000;

    if (this.generations.length <= checkRecentGenerationsCount) {
      return true;
    }

    if (this.generations.length >= maxGenerationsCount) {
      return false;
    }

    const worstMaximumFitnessInRecentGenerations =
        Math.max(
            ...this.generations
            .slice(this.generations.length - checkRecentGenerationsCount - 1, this.generations.length - 1)
            .map(item => Math.min(...item.genotypes.map(item => item.fitness.score)))
        );

    const lastGeneration = this.getLastGeneration();
    const maximumFitnessInLastGeneration = Math.min(...lastGeneration.genotypes.map(item => item.fitness.score))

    return maximumFitnessInLastGeneration < worstMaximumFitnessInRecentGenerations;
  }
}
