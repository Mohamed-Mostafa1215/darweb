import { Component, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loss-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loss-calculator.component.html',
  styleUrl: './loss-calculator.component.css'
})
export class LossCalculatorComponent {
  /** يُطلق إشارة للـ parent عند الضغط على "جرّب الآن" */
  scrollToDemo = output<void>();

  // Angular Signals — تحديث لحظي بدون ChangeDetection
  dailyCustomers  = signal(50);
  avgOrderValue   = signal(500);
  churnRate       = signal(60);

  /** الخسارة الشهرية = عدد العملاء × متوسط الطلب × نسبة عدم العودة × 30 */
  monthlyLoss = computed(() =>
    Math.round(this.dailyCustomers() * this.avgOrderValue() * (this.churnRate() / 100) * 30)
  );

  yearlyLoss = computed(() => this.monthlyLoss() * 12);

  /** توصية ذكية بالباقة المناسبة حسب حجم الخسارة */
  recommendedPackage = computed(() => {
    const loss = this.monthlyLoss();
    if (loss < 20_000)  return { name: 'الباقة الأساسية',   price: 'تبدأ من 3,000 ج.م', setup: '900',   icon: '🌱' };
    if (loss < 60_000)  return { name: 'الباقة الاحترافية', price: 'تبدأ من 7,000 ج.م', setup: '2,100', icon: '🔥' };
    return                     { name: 'الباقة المتقدمة',   price: 'تسعير مخصص',        setup: '3,000+', icon: '🚀' };
  });

  formatNumber(n: number): string {
    return n.toLocaleString('ar-EG');
  }

  onSliderChange(key: 'dailyCustomers' | 'avgOrderValue' | 'churnRate', value: string) {
    const num = parseInt(value, 10);
    if (key === 'dailyCustomers') this.dailyCustomers.set(num);
    else if (key === 'avgOrderValue') this.avgOrderValue.set(num);
    else this.churnRate.set(num);
  }

  onScrollToDemo() {
    this.scrollToDemo.emit();
  }
}
