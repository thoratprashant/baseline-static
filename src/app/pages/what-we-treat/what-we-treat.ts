import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-what-we-treat-page',
  imports: [RouterLink, Cta],
  templateUrl: './what-we-treat.html',
})
export class WhatWeTreat {}
