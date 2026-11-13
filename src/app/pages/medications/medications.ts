import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-medications-page',
  imports: [RouterLink, Cta],
  templateUrl: './medications.html',
})
export class Medications {}
