import { connect } from "react-redux";

import {clearSettings} from 'redux/settings/actions';

import { PreviewComponent } from "./Preview";

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = {
  clearSettings
};

export const PreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewComponent);
