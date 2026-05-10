import { Routes } from '@angular/router';

export const routes: Routes = [
  // ── Priority Routes (Standalone) ──
  {
    path: 'checkout/:planId',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
    data: { title: 'إتمام الدفع | DarWeb', description: 'أكمل تسجيلك واحجز نظامك الآن.' }
  },
  {
    path: 'thank-you',
    loadComponent: () =>
      import('./features/checkout/thank-you/thank-you.component').then((c) => c.ThankYouComponent),
    data: { title: 'تم الدفع بنجاح! | DarWeb', description: 'شكراً لك، سنبدأ التجهيز فوراً.' }
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/checkout/onboarding/onboarding.component').then((c) => c.OnboardingComponent)
  },

  // ── Agency Landing Pages (Wrapped in Layout) ──
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/agency-layout/agency-layout.component').then(
        (c) => c.AgencyLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/agency/home/home.component').then((c) => c.HomeComponent),
        data: { title: 'الرئيسية | تصميم متجر إلكتروني ومواقع شركات - DarWeb', description: 'نبني مواقع احترافية وتطبيقات تجارية تُحدث فرقاً حقيقياً.' }
      },
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/agency/about/about.component').then((c) => c.AboutComponent),
        data: { title: 'من نحن | أفضل شركة تصميم مواقع - DarWeb', description: 'تعرف على فريق الخبراء خلف منصات دار ويب.' }
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/agency/projects/projects.component').then((c) => c.ProjectsComponent),
        data: { title: 'أعمالنا | نماذج تصميم مواقع ومتاجر - DarWeb', description: 'تصفح سابقة أعمالنا في تصميم المتاجر الإلكترونية والمواقع التعريفية.' }
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./features/agency/testimonials/testimonials.component').then((c) => c.TestimonialsComponent),
        data: { title: 'آراء العملاء | DarWeb', description: 'شاهد ماذا يقول عملاؤنا عن خدماتنا.' }
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/agency/contact/contact.component').then((c) => c.ContactComponent),
        data: { title: 'تواصل معنا | احصل على استشارة لتصميم موقعك - DarWeb', description: 'تواصل معنا الآن للحصول على استشارة مجانية لمشروعك الرقمي.' }
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/agency/blog/blog.component').then((c) => c.BlogComponent),
        data: { title: 'المدونة | نصائح لنجاح البيزنس أونلاين - DarWeb', description: 'مقالات حول التجارة الإلكترونية، تصميم المواقع، وزيادة المبيعات.' }
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/agency/blog-post/blog-post.component').then((c) => c.BlogPostComponent)
      },
      {
        path: 'demo',
        loadComponent: () =>
          import('./features/agency/demo/chameleon-demo.component').then((c) => c.ChameleonDemoComponent),
        data: { title: 'السحر التقني | جرب النظام الخاص بك - DarWeb', description: 'شاهد تجربة حية لكيف سيبدو النظام الخاص بمشروعك.' }
      }
    ],
  },

  // ── Fallback ──
  {
    path: '**',
    redirectTo: 'home',
  },
];