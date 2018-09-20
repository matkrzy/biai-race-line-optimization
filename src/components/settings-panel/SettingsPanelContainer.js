import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm } from "redux-form";

import { setSettings } from "redux/settings/actions";

import { SettingsPanel } from "./SettingsPanel";

const mapStateToProps = state => ({
  initialValues: {
    generationSize: 32,
    mutationRatio: 0.005,
    crossingOverRatio: 1.0,
    track: {
      width: 15
    },
    car: {
      width: 2,
      weight: 500,
      torque: 500,
      dragCoefficient: 0.8,
      frictionCoefficient: 1.5,
      deceleration: -30,
      wheelDiameter: 0.66
    }
  }
});

const mapDispatchToProps = {
  onSubmit: setSettings
};

export const SettingsPanelContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: "settings"
  })
)(SettingsPanel);
