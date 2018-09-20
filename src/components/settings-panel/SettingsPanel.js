import React, { Component, Fragment } from "react";
import { Field } from "redux-form";

import { Drawer, Typography, TextField, Button, withStyles } from "material-ui";
import { styles } from "./SettingsPanel.styles";

const ConnectedField = props => {
  const { placeholder, label, input, meta, type, className } = props;
  const other = {
    placeholder,
    label,
    type
  };

  return (
    <Fragment>
      <TextField {...other} margin="none" className={className} {...input} />
      {meta.error && meta.touched && <span>{meta.error}</span>}
    </Fragment>
  );
};

class SettingsPanelComponent extends Component {
  componentDidMount() {
    this.props.submit();
  }

  render() {
    const { classes, handleSubmit } = this.props;

    return (
      <Drawer
        variant="permanent"
        anchor="bottom"
        open={true}
        className={classes.drawer}
        PaperProps={{
          classes: { root: classes.paper }
        }}
      >
        <Typography className={classes.title}>Settings</Typography>

        <form onSubmit={handleSubmit}>
          <Field
            className={classes.field}
            name="generationSize"
            component={ConnectedField}
            type="number"
            placeholder="enter population size"
            label="population size"
          />

          <Field
            className={classes.field}
            name="mutationRatio"
            component={ConnectedField}
            type="number"
            placeholder="enter mutation ratio"
            label="mutation ratio"
          />

          <Field
            className={classes.field}
            name="crossingOverRatio"
            component={ConnectedField}
            type="number"
            placeholder="enter crossing-over ratio"
            label="crossover ratio"
          />

          <Field
            className={classes.field}
            name="track.width"
            component={ConnectedField}
            type="number"
            placeholder="enter track width (m)"
            label="track width (m)"
          />

          <Field
            className={classes.field}
            name="car.width"
            component={ConnectedField}
            type="number"
            placeholder="enter car width (m)"
            label="car width (m)"
          />

          <Field
              className={classes.field}
              name="car.weight"
              component={ConnectedField}
              type="number"
              placeholder="enter car weight (kg)"
              label="car weight (kg)"
          />

          <Field
              className={classes.field}
              name="car.torque"
              component={ConnectedField}
              type="number"
              placeholder="enter car torque (N*m)"
              label="car torque (N*m)"
          />

          <Field
              className={classes.field}
              name="car.dragCoefficient"
              component={ConnectedField}
              type="number"
              placeholder="enter car drag coefficient"
              label="car drag coefficient"
          />

          <Field
              className={classes.field}
              name="car.frictionCoefficient"
              component={ConnectedField}
              type="number"
              placeholder="enter car tyre friction coefficient"
              label="car tyre friction coefficient"
          />

          <Field
            className={classes.field}
            name="car.deceleration"
            component={ConnectedField}
            type="text"
            placeholder="enter car deceleration (m/s^2)"
            label="car deceleration (m/s^2)"
          />

          <Field
            className={classes.field}
            name="car.wheelDiameter"
            component={ConnectedField}
            type="number"
            placeholder="enter car wheel diameter (m)"
            label="car wheel diameter (m)"
          />

          <Button variant="raised" type="submit">
            save
          </Button>
        </form>
      </Drawer>
    );
  }
}

export const SettingsPanel = withStyles(styles)(SettingsPanelComponent);
