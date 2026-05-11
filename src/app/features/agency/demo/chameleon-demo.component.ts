import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DynamicWidgetComponent } from '../../../shared/ui/dynamic-widget/dynamic-widget.component';
import { NICHES, NicheConfig } from '../../../core/data/niches.data';

@Component({
  selector: 'app-chameleon-demo',
  standalone: true,
  imports: [CommonModule, DynamicWidgetComponent],
  templateUrl: './chameleon-demo.component.html',
  styleUrl: './chameleon-demo.component.css'
})
export class ChameleonDemoComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  niches = NICHES;
  selectedNicheId = signal<string>(NICHES[0].id);

  currentDemo = computed<NicheConfig>(() => {
    return this.niches.find(n => n.id === this.selectedNicheId()) || this.niches[0];
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type && this.niches.find(n => n.id === type)) {
        this.selectedNicheId.set(type);
      }
    });
  }

  selectSector(id: string) {
    this.selectedNicheId.set(id);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: id },
      queryParamsHandling: 'merge'
    });
  }

  onScrollToPricing() {
    const pricingElement = document.getElementById('pricing-section');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/'], { fragment: 'pricing' });
    }
  }

  onImageClick() {
    Swal.fire({
      title: 'أعجبك التصميم؟ 😍',
      text: 'هذا مجرد نموذج مبدئي (Demo).. سيتم برمجة وتصميم النظام بالكامل بخصائص حقيقية مصممة خصيصاً لمشروعك عند طلب الباقة!',
      icon: 'info',
      confirmButtonText: 'جرب باقتك الآن 🚀',
      confirmButtonColor: '#a78bfa',
      background: '#0f172a',
      color: '#fff'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.onScrollToPricing();
      }
    });
  }
}
