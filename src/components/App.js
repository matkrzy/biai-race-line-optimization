import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";
import { reducer as formReducer } from "redux-form";
import { devToolsEnhancer } from "redux-devtools-extension/logOnlyInProduction";

import { Wrapper } from "components/shared/wrapper/Wrapper";
import { PreviewContainer } from "components/preview/PreviewContainer";
import { SettingsPanelContainer } from "components/settings-panel/SettingsPanelContainer";

import { settingsReducer } from "../redux/settings/reducer";

const store = createStore(
  combineReducers({
    settings: settingsReducer,
    form: formReducer
  }),
  compose(devToolsEnhancer({}))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Wrapper>
          <PreviewContainer />
          <SettingsPanelContainer />
        </Wrapper>
      </Provider>
    );
  }
}

export default App;
