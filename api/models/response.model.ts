/*
 * Copyright (c) 2019. A production of Enchird-Tech (https://enchirdentity.com/privacy-policy),
 * all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 * */

export class ResponseMessage {
  status: boolean;
  data: any;
  message: string;
  constructor(status: boolean = false, data: any = null, message: string = null) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
