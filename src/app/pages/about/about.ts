import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-about-page',
  imports: [RouterLink, Cta],
  templateUrl: './about.html',
})
export class About {}
