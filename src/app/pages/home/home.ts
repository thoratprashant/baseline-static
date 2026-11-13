import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-home-page',
  imports: [RouterLink, Cta],
  templateUrl: './home.html',
})
export class Home {}
