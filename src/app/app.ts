import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe((data) => {
      // Update Title
      const title = data['title'] ? data['title'] : 'DarWeb | أفضل شركة تصميم مواقع وتطبيقات';
      this.titleService.setTitle(title);
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ name: 'twitter:title', content: title });

      // Update Description
      const desc = data['description'] ? data['description'] : 'ضاعف مبيعاتك مع متجر إلكتروني احترافي أو موقع شركة مميز من دار ويب.';
      this.metaService.updateTag({ name: 'description', content: desc });
      this.metaService.updateTag({ property: 'og:description', content: desc });
      this.metaService.updateTag({ name: 'twitter:description', content: desc });
    });
  }
}
