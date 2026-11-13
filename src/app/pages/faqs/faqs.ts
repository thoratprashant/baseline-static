import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cta } from '../../shared/cta/cta';

@Component({
  selector: 'bh-faqs-page',
  imports: [RouterLink, Cta],
  templateUrl: './faqs.html',
})
export class Faqs {}
