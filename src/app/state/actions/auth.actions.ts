/*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 */
import {Action} from '@ngrx/store';
export const SET_AUTH_USER = '[SET_AUTH] USER';
export const CLEAR_AUTH_USER = '[CLEAR_AUTH] USER';

export class SetAuthUser implements Action {
  readonly type = SET_AUTH_USER;
  constructor(public payload) {}
}

export class ClearAuthUser implements Action {
  readonly type = CLEAR_AUTH_USER;
  constructor() {}
}

export type AuthActions = SetAuthUser | ClearAuthUser;

