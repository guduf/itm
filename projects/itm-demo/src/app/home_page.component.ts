import { Component, OnInit } from '@angular/core';
import { Range } from 'immutable';

@Component({
  selector: 'itm-demo-home-page',
  templateUrl: 'home_page.component.html',
  styleUrls: ['./home_page.component.scss']
})
export class HomePageComponent implements OnInit {
  blueprintCells = Range(0, 8).toArray();

  constructor() { }

  ngOnInit() { }
}
