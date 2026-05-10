import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'checkout/:planId',
    renderMode: RenderMode.Client
  },
  {
    path: 'thank-you',
    renderMode: RenderMode.Client
  },
  {
    path: 'onboarding',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
