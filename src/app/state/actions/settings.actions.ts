/*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 */
import { Action } from '@ngrx/store';
import { SettingsModel } from '../../../../api/models';


export const UPDATE_SETTINGS = '[SETTINGS] UPDATE';
export const RESET_SETTINGS = '[SETTINGS] RESET';

export class UpdateSettings implements Action {
  readonly type = UPDATE_SETTINGS;

  constructor(public payload: SettingsModel) {}
}

export class ResetSettings implements Action {
  readonly type = RESET_SETTINGS;
  constructor() {}
}

export type Actions = UpdateSettings | ResetSettings;
