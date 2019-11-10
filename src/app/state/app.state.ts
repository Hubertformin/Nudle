/*
 * Copyright (c) 2019. A production of Silverslopes-cm, all rights reserved, no part of the project should be reproduced without prior
 * concern of authorized personnel.
 */
import {SettingsModel} from '../../../api/models';
import {StaffEntity} from '../data-access/entities';

export interface AppState {
  readonly settings: SettingsModel;
  readonly authUser: StaffEntity;
}
