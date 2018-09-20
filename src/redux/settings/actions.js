import { createAction } from "redux-actions";

import { SET_NEW_SETTINGS, CLEAR_SETTINGS } from "./actions-types";

export const setSettings = createAction(SET_NEW_SETTINGS, settings => settings);

export const clearSettings = createAction(CLEAR_SETTINGS);
