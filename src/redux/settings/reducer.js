import { SET_NEW_SETTINGS, CLEAR_SETTINGS } from "./actions-types";

export const settingsReducer = (state = {}, { payload, type }) => {
  switch (type) {
    case SET_NEW_SETTINGS:
      return {
        ...payload
      };
    case CLEAR_SETTINGS:
      return {};

    default:
      return state;
  }
};
