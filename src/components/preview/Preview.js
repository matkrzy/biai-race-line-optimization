import {
  Background,
  Circle,
  Population,
  RacingLine,
  Track,
  Vehicle,
  View
} from "classes";
import React, { Component } from "react";
import classnames from "classnames";
import { MenuItem, withStyles, TextField } from "material-ui";
import isEqual from "lodash/isEqual";

import { fitnessFunction } from "utils/fitnessFunction";

import "./preview.css";
import { styles } from "./Preview.styles";

class Preview extends Component {
  constructor(props) {
    super(props);

    this.output = null;

    this.state = {
      w: window.innerWidth,
      h: window.innerHeight,
      move: false,
      trackLoaded: false,
      initialized: false,
      generation: 0,
      genotype: 0
    };

    this.x = 0;
    this.y = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    //global events
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousewheel", this.onScroll);
    window.addEventListener("drop", this.handleDrop, false);
    window.addEventListener("dragover", this.handleDragOver, false);

    window.preview = this;
  }

  componentDidMount() {
    //simulation data
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.track = null;
    this.view = new View(this.canvas, this.ctx);
    this.vehicle = null;
    this.population = null;

    this.background = new Background();
    this.view.addObject(this.background);
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (
      !isEqual(prevProps.settings, this.props.settings) &&
      this.state.initialized
    ) {
      this.view.removeObject(this.track);
      this.view.removeObject(this.racingLine);

      this.population = null;
      this.generation = null;
      this.genotype = null;

      this.track = null;
      this.vehicle = null;

      this.init();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousewheel scroll wheel", this.onScroll);
  }

  createPopulation = () =>
    new Population(
      this.props.settings.generationSize,
      this.props.settings.mutationRatio,
      this.props.settings.crossingOverRatio,
      fitnessFunction,
      {
        track: this.track,
        vehicle: this.vehicle
      }
    );

  init() {
    this.track = new Track(this.trackData, this.props.settings.track);
    this.vehicle = new Vehicle(this.props.settings.car);
    this.population = this.createPopulation();

    while (this.population.canBeImproved()) {
      this.population.evolve();
    }

    this.track.axisPoints.forEach(point =>
      this.view.addObject(new Circle(point))
    );

    const times = this.population.generations.map(item => {
      return {
        min: Math.min(...item.genotypes.map(item => item.fitness.score)),
        max: Math.max(...item.genotypes.map(item => item.fitness.score)),
        avg:
          item.genotypes
            .map(item => item.fitness.score)
            .reduce((a, b) => a + b, 0) / item.genotypes.length
      };
    });

    this.output = { generations: this.population.generations, times };
    console.log(this.output);

    this.generation = this.population.getLastGeneration();
    this.genotype = this.generation.getGenotype(
      this.generation.genotypes.length - 1
    );
    this.racingLine = this.genotype.getRacingLine();

    this.view.addObject(this.track);
    this.view.addObject(this.racingLine);

    this.view.fitToTrack(this.track, { x: 0, y: 0 });

    this.zoomSlider = Math.log(this.view.getZoom()) / Math.log(10);

    this.setState(
      {
        initialized: true,
        generation: 0,
        genotype: 0
      },
      this.view.draw
    );
  }

  handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  };

  handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0]; // FileList object.

    const reader = new FileReader();

    reader.onload = (file => {
      return e => {
        const fileName = file.name;

        this.trackData = JSON.parse(e.target.result);
        this.setState({ fileName, trackLoaded: true }, this.init);
      };
    })(file);

    reader.readAsBinaryString(file);
  };

  onResize = () => {
    this.setState(
      {
        w: window.innerWidth,
        h: window.innerHeight
      },
      this.view.draw
    );
  };

  onScroll = e => {
    const { target } = e;

    if (target !== this.canvas) {
      return e;
    }

    e.preventDefault();

    const zoomMax = 2;
    const zoomMin = -1;
    const zoomStep = 0.1;

    const { wheelDeltaY } = e;

    if (wheelDeltaY > 0) {
      //zoom out
      if (this.zoomSlider < zoomMin) {
        return;
      }

      this.zoomSlider -= zoomStep;
    } else {
      //zoom in
      if (this.zoomSlider > zoomMax) {
        return;
      }
      this.zoomSlider += zoomStep;
    }

    this.view.setZoom(Math.pow(10, this.zoomSlider));
    this.view.draw();
  };

  mouseDown = e => {
    e.persist();
    this.setState({ move: true }, () => {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
  };

  mouseUp = e => {
    this.setState(
      {
        move: false
      },
      () => {
        this.lastMouseX = null;
        this.lastMouseY = null;
      }
    );
  };

  mouseMove = e => {
    if (this.state.move) {
      const { x: lastPanX, y: lastPanY, lastMouseX, lastMouseY } = this;

      const { clientX, clientY } = e;

      const panRatio = 0.1;

      if (lastMouseX != null) {
        const panX = lastPanX + Math.round((lastMouseX - clientX) * panRatio);
        const panY = lastPanY - Math.round((lastMouseY - clientY) * panRatio);

        this.x = panX;
        this.y = panY;

        this.view.setPan({ x: this.x, y: this.y });
        this.view.draw();
      }
    }
  };

  handleGenerationChange = event => {
    const {
      target: { value }
    } = event;

    const generationIndex = parseInt(value, 10);
    const genotypeIndex = 0;

    this.generation = this.population.getGeneration(generationIndex);
    this.genotype = this.generation.getGenotype(genotypeIndex);

    this.view.removeObject(this.racingLine);
    this.racingLine = this.genotype.getRacingLine();
    this.view.addObject(this.racingLine);

    this.setState(
      {
        generation: generationIndex,
        genotype: genotypeIndex
      },
      this.view.draw
    );
  };

  handleGenotypeChange = event => {
    const {
      target: { value }
    } = event;

    const generationIndex = this.state.generation;
    const genotypeIndex = parseInt(value, 10);

    this.genotype = this.generation.getGenotype(genotypeIndex);

    this.view.removeObject(this.racingLine);
    this.racingLine = this.genotype.getRacingLine();
    this.view.addObject(this.racingLine);

    this.setState(
      {
        generation: generationIndex,
        genotype: genotypeIndex
      },
      this.view.draw
    );
  };

  handleSave = () => {
    const json = JSON.stringify(this.output);

    const file = new Blob([json], { type: "octet/stream" });
    const url = URL.createObjectURL(file);
    URL.revokeObjectURL(url);
  };

  render() {
    const { classes } = this.props;
    const { trackLoaded, initialized, move } = this.state;

    const classNames = classnames("preview", { move: move });

    return (
      <section>
        {(!trackLoaded || !initialized) && (
          <div className={classes.placeholder}>
            <div>Open track data (drop it here)</div>
          </div>
        )}

        <div className={classes.selectors}>
          <TextField
            className={classes.select}
            select
            label="generation"
            value={this.state.generation}
            margin="normal"
            onChange={this.handleGenerationChange}
          >
            {!!this.population ? (
              this.population.getGenerations().map((generation, index) => (
                <MenuItem value={parseInt(index, 10)} key={index}>
                  {parseInt(index, 10)}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={0}>0</MenuItem>
            )}
          </TextField>

          <TextField
            className={classes.select}
            select
            label="genotype"
            value={this.state.genotype}
            margin="normal"
            onChange={this.handleGenotypeChange}
          >
            {!!this.population ? (
              this.generation.getGenotypes().map((genotype, index) => (
                <MenuItem value={parseInt(index, 10)} key={index}>
                  {parseInt(index, 10)}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={0}>0</MenuItem>
            )}
          </TextField>
        </div>

        <canvas
          className={classNames}
          id="canvas"
          width={this.state.w}
          height={this.state.h}
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          onMouseMove={this.mouseMove}
          ref={canvas => (this.canvas = canvas)}
        />
      </section>
    );
  }
}

export const PreviewComponent = withStyles(styles)(Preview);
