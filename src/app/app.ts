import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

/** Globals provided by angular.json "scripts": Bootstrap bundle + Baseline behaviours (main.js). */
declare global {
  interface Window {
    BH?: { init: (root?: ParentNode) => void };
    bootstrap?: { Offcanvas: { getInstance: (el: Element) => { hide: () => void } | null } };
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => {
        // Close the mobile menu after navigating
        const menu = document.getElementById('mobileMenu');
        if (menu) window.bootstrap?.Offcanvas.getInstance(menu)?.hide();

        // Per-page meta description
        let r = this.route;
        while (r.firstChild) r = r.firstChild;
        const description = r.snapshot.data['description'];
        if (description) this.meta.updateTag({ name: 'description', content: description });

        // Re-run reveal animations, filters, FAQ search etc. on the new view
        setTimeout(() => window.BH?.init(document));
      });
  }
}
