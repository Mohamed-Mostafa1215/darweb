import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  // Form fields
  projectName = '';
  domainName = '';
  brandColors = '';
  requirements = '';
  logoUrl = '';

  // State signals
  submitting = signal(false);
  submitted = signal(false);
  validationError = signal('');

  constructor(
    public router: Router,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('خطوة واحدة لبدء مشروعك | DarWeb Onboarding');
    this.meta.updateTag({ name: 'description', content: 'أكمل بيانات مشروعك لنبدأ التنفيذ فوراً.' });
  }

  async submitOnboarding() {
    if (!this.projectName.trim()) {
      this.validationError.set('برجاء إدخال اسم المشروع');
      return;
    }

    this.submitting.set(true);
    this.validationError.set('');

    const formData = {
      projectName: this.projectName,
      domainName: this.domainName,
      brandColors: this.brandColors,
      requirements: this.requirements,
      logoUrl: this.logoUrl,
      source: 'Onboarding Form'
    };

    try {
      const text = `🚀 *طلب بدء تنفيذ جديد!* 🚀\n\n` +
                   `🏢 *اسم المشروع:* ${this.projectName}\n` +
                   `🌐 *الدومين المقترح:* ${this.domainName || 'غير محدد'}\n` +
                   `🎨 *الألوان:* ${this.brandColors || 'غير محدد'}\n` +
                   `📝 *المتطلبات:* ${this.requirements || 'لا يوجد'}\n` +
                   `🖼️ *اللوجو:* ${this.logoUrl || 'لا يوجد'}`;

      // 1. Formspree
      fetch('https://formspree.io/f/xwvybqor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Formspree Error:', err));

      // 2. Telegram
      const telegramToken = '8087307735:AAEVnHKtvnlxEWePS6Ue81PWW6na8Zmp5zg';
      const chatId = '6785454741';
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
      }).catch(err => console.error('Telegram Error:', err));

      this.submitting.set(false);
      this.submitted.set(true);

      // Redirect to home after 5 seconds or stay on success
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 6000);

    } catch (error) {
      this.submitting.set(false);
      this.validationError.set('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.');
    }
  }
}
