import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface CheckoutPlan {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  features: string[];
  badge?: string;
}

const PLANS: CheckoutPlan[] = [
  {
    id: 'landing',
    title: 'نظام الصفحة الواحدة',
    subtitle: 'Landing Page احترافية',
    price: 900,
    currency: 'ج.م',
    badge: 'الأكثر طلباً',
    features: [
      'إعداد وتجهيز نظام الصفحة الواحدة الخاص بك',
      'ربط النطاق (Domain) والاستضافة السحابية',
      'دعم فني ومتابعة أداء لمدة 30 يوم',
      'تصميم متجاوب مع جميع الأجهزة',
      'تحسين محركات البحث (SEO) الأساسي',
    ],
  },
  {
    id: 'store',
    title: 'نظام المتجر الإلكتروني',
    subtitle: 'متجر كامل مع لوحة تحكم',
    price: 2100,
    currency: 'ج.م',
    features: [
      'إعداد وتجهيز نظام المتجر الإلكتروني الخاص بك',
      'ربط النطاق (Domain) والاستضافة السحابية',
      'دعم فني ومتابعة أداء لمدة 30 يوم',
      'لوحة تحكم كاملة لإدارة المنتجات',
      'ربط بوابة دفع إلكترونية آمنة',
    ],
  },
  {
    id: 'system',
    title: 'نظام الأعمال المتكامل',
    subtitle: 'ERP / CRM مخصص',
    price: 6000,
    currency: 'ج.م',
    features: [
      'إعداد وتجهيز النظام الإداري الخاص بمؤسستك',
      'ربط النطاق (Domain) والاستضافة السحابية',
      'دعم فني ومتابعة أداء لمدة 30 يوم',
      'نظام إدارة مستخدمين وصلاحيات متقدم',
      'تقارير وتحليلات مخصصة لنشاطك',
    ],
  },
];

/**
 * روابط الدفع الخاصة بك من Paymob
 * قم باستبدالها بالروابط الحقيقية التي ستنشئها
 */
const PAYMENT_LINKS: Record<string, string> = {
  'landing': 'https://accept.paymob.com/api/accept/cards/iframe/YOUR_IFRAME_ID?payment_token=YOUR_TOKEN_OR_LINK', 
  'store': 'https://accept.paymob.com/api/accept/cards/iframe/YOUR_IFRAME_ID?payment_token=YOUR_TOKEN_OR_LINK',
  'system': 'https://accept.paymob.com/api/accept/cards/iframe/YOUR_IFRAME_ID?payment_token=YOUR_TOKEN_OR_LINK'
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  plan: CheckoutPlan | null = null;
  notFound = false;

  // Form fields
  clientName = '';
  clientEmail = '';
  clientPhone = '';
  paymentMethod: 'card' | 'instapay' | 'wallet' = 'card';
  paymentDetail = ''; 

  // State signals
  submitting = signal(false);
  submitted = signal(false);
  validationError = signal('');
  
  // Paymob specific
  showIframe = signal(false);
  paymobIframeUrl = signal<SafeResourceUrl | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId') ?? '';
    this.plan = PLANS.find((p) => p.id === planId) ?? null;

    if (!this.plan) {
      this.notFound = true;
      return;
    }

    this.titleService.setTitle(`إتمام الدفع | ${this.plan.title} - DarWeb`);
  }

  private validate(): boolean {
    if (!this.clientName.trim()) {
      this.validationError.set('برجاء إدخال الاسم الكريم');
      return false;
    }
    if (!this.clientEmail.trim() || !this.clientEmail.includes('@')) {
      this.validationError.set('برجاء إدخال بريد إلكتروني صحيح');
      return false;
    }
    if (!this.clientPhone.trim() || this.clientPhone.length < 10) {
      this.validationError.set('برجاء إدخال رقم هاتف صحيح');
      return false;
    }
    this.validationError.set('');
    return true;
  }

  submitPayment(): void {
    if (!this.validate()) return;
    this.submitting.set(true);

    // محاكاة تأمين الاتصال قبل فتح بوابة الدفع
    setTimeout(() => {
      this.submitting.set(false);
      
      if (this.paymentMethod === 'card') {
        // نستخدم رابط الدفع الخاص بالباقة المحددة
        const link = PAYMENT_LINKS[this.plan?.id || 'landing'];
        this.paymobIframeUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(link)
        );
        this.showIframe.set(true);
      } else {
        // للمحافظ وإنستاباي، التوجه لصفحة النجاح مباشرة
        this.proceedToSuccess();
      }
    }, 1500);
  }

  /**
   * يتم استدعاؤها بعد إغلاق الـ Iframe أو إتمام الدفع اليدوي
   */
  proceedToSuccess(): void {
    this.showIframe.set(false);
    this.submitted.set(true);
    
    setTimeout(() => {
      this.router.navigate(['/thank-you'], {
        state: {
          clientName: this.clientName,
          planTitle: this.plan?.title,
          planPrice: this.plan?.price,
          planCurrency: this.plan?.currency,
          orderId: `DW-${Math.floor(Math.random() * 9000) + 1000}`
        },
      });
    }, 1000);
  }

  getWhatsAppLink(): string {
    const msg = encodeURIComponent(
      `مرحباً، أريد الاستفسار عن باقة "${this.plan?.title}" وإتمام التعاقد.`
    );
    return `https://wa.me/201152597819?text=${msg}`;
  }
}
