import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-how-it-works-page',
  imports: [RouterLink, Cta],
  templateUrl: './how-it-works.html',
})
export class HowItWorks {}
