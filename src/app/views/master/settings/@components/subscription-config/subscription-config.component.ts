import { Component, OnInit } from '@angular/core';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription-config.component.html',
  styleUrls: ['./subscription-config.component.scss']
})
export class SubscriptionConfigComponent implements OnInit {
    checkIcon = faCheckCircle;

  constructor() { }

  ngOnInit() {
  }

}
