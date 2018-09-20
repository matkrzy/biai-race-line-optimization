export class Gene {
  constructor(offset) {
    this.offset = typeof offset === "undefined" ? Math.random() : offset;
  }

  getOffset = () => this.offset;

  setOffset = (offset) => this.offset = offset;

  withMutation = () => new Gene(Math.random());
}
