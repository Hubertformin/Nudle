/*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 */
import * as SettingActions from '../actions/settings.actions';
import * as AuthActions from '../actions/auth.actions';
import {Directories} from '../../../../api/modules/directories-module';

const initialState = Directories.getAppConfig();

export function settingsReducer(state = initialState, action: SettingActions.Actions) {

  switch (action.type) {
    case '[SETTINGS] UPDATE':
      return action.payload;
      case '[SETTINGS] RESET':
        return initialState;
    default:
      return initialState;
  }
}

const savedUser = sessionStorage.getItem('authUser') ? JSON.parse(sessionStorage.getItem('authUser')) : {};
export function authUserReducer(state = savedUser, action: AuthActions.AuthActions) {
  switch (action.type) {
    case '[SET_AUTH] USER':
      return action.payload;
      case '[CLEAR_AUTH] USER':
        return state;
    default:
      return state;
  }
}


