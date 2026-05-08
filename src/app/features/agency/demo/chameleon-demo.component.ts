import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export type Sector = 'clinic' | 'decor' | 'trade' | 'ecommerce';

interface DemoData {
  title: string;
  subtitle: string;
  features: string[];
  imageUrl: string;
  metrics: { label: string; value: string }[];
  projectName: string;
}

const DEMO_DATA: Record<Sector, DemoData> = {
  clinic: {
    title: 'نظام حجز العيادات الذكي',
    subtitle: 'وفر وقت السكرتارية بنسبة 80% مع حجز آلي وربط بالواتساب',
    features: ['حجز مواعيد أونلاين 24/7', 'رسائل تذكير تلقائية للمرضى', 'ملف طبي إلكتروني لكل مريض'],
    imageUrl: 'assets/images/mockups/clinic.png',
    metrics: [{ label: 'زيادة الحجوزات', value: '+45%' }, { label: 'تقليل التخلف عن الموعد', value: '-60%' }],
    projectName: 'Smile Dental Clinic'
  },
  decor: {
    title: 'منصة إدارة مشاريع الديكور',
    subtitle: 'تابع سير العمل، احسب التكاليف، وشارك التحديثات مع عملائك في مكان واحد',
    features: ['حاسبة تكاليف وخامات لحظية', 'جدول زمني مرئي للمشروع', 'مشاركة الصور والتحديثات مع العميل'],
    imageUrl: 'assets/images/mockups/decor.png',
    metrics: [{ label: 'دقة التسعير', value: '99%' }, { label: 'رضا العملاء', value: '+85%' }],
    projectName: 'ChainPulse Dashboard'
  },
  trade: {
    title: 'نظام إدارة الوسطاء والتجارة',
    subtitle: 'نظّم تعاملاتك المالية، وادفع بأمان عبر نظام Escrow متكامل',
    features: ['نظام دفع مرحلي (Escrow)', 'لوحة تحكم لإدارة الوسطاء', 'إشعارات لحظية بالمدفوعات'],
    imageUrl: 'assets/images/mockups/escrow.png',
    metrics: [{ label: 'سرعة التحصيل', value: '3x' }, { label: 'نزاعات أقل', value: '-90%' }],
    projectName: 'Arboon Platform'
  },
  ecommerce: {
    title: 'متجر إلكتروني يبيع وأنت نائم',
    subtitle: 'واجهة سريعة، ربط ببوابات الدفع، وتجربة تسوق لا تُنسى',
    features: ['سلة مشتريات ذكية', 'كوبونات وخصومات ديناميكية', 'تتبع الطلبات للعملاء'],
    imageUrl: 'assets/images/mockups/ecommerce.png',
    metrics: [{ label: 'معدل التحويل', value: '+3.5%' }, { label: 'سلة متروكة أقل', value: '-25%' }],
    projectName: 'Zayngular E-Commerce'
  }
};

@Component({
  selector: 'app-chameleon-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chameleon-demo.component.html',
  styleUrl: './chameleon-demo.component.css'
})
export class ChameleonDemoComponent {
  private router = inject(Router);

  selectedSector = signal<Sector>('ecommerce');

  currentDemo = computed(() => DEMO_DATA[this.selectedSector()]);

  selectSector(sector: Sector) {
    this.selectedSector.set(sector);
  }

  onScrollToPricing() {
    this.router.navigate(['/home'], { fragment: 'pricing' });
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
