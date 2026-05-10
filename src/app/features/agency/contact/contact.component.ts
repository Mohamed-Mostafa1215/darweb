import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyService } from '../../../core/services/agency.service';
import { GlassCardComponent } from '../../../shared/ui/glass-card/glass-card.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const pkg = sessionStorage.getItem('selectedPackage');
      if (pkg) {
        this.autoFillBudget(pkg);
        sessionStorage.removeItem('selectedPackage');
        // If we auto-filled the budget, we might want to also set a default project type to speed things up
        if (!this.selectedProject) {
          if (pkg === 'احترافية') this.selectedProject = 'متجر إلكتروني';
          else if (pkg === 'متقدمة') this.selectedProject = 'نظام إدارة';
          else this.selectedProject = 'موقع شركة';
        }
        // Skip step 1 if project is selected to jump user to budget / details
        this.step = 2;
      }
    }
  }

  autoFillBudget(pkg: string) {
    const map: Record<string, string> = {
      'أساسية':   'أقل من 5,000 جنيه',
      'احترافية': '5,000 - 10,000 جنيه',
      'متقدمة':   'أكثر من 10,000 جنيه',
    };
    this.selectedBudget = map[pkg] || '';
  }


  // Wizard state — plain properties, Default CD, no signals needed
  step = 1;
  validationError = '';
  submitting = false;
  submitted = false;

  // Selections
  selectedProject = '';
  selectedBudget = '';
  clientName = '';
  clientPhone = '';
  clientTime = '';
  clientMessage = '';

  readonly projectOptions = [
    { value: 'متجر إلكتروني', label: 'متجر إلكتروني 🛒', sub: 'لبيع المنتجات أونلاين' },
    { value: 'موقع شركة',    label: 'موقع شركة 🏢',    sub: 'واجهة احترافية لعملك' },
    { value: 'نظام إدارة',   label: 'نظام إدارة ⚙️',   sub: 'SaaS أو لوحة تحكم'   },
    { value: 'أخرى',         label: 'أخرى 💡',         sub: 'فكرة جديدة مختلفة'    },
  ];

  readonly budgetOptions = [
    'أقل من 5,000 جنيه',
    '5,000 - 10,000 جنيه',
    'أكثر من 10,000 جنيه',
    'لست متأكداً (أحتاج استشارة)',
  ];

  selectProject(val: string) {
    this.selectedProject = val;
    this.validationError = '';
  }

  selectBudget(val: string) {
    this.selectedBudget = val;
    this.validationError = '';
  }

  next() {
    if (this.step === 1 && !this.selectedProject) {
      this.validationError = 'الرجاء اختيار نوع المشروع أولاً';
      return;
    }
    if (this.step === 2 && !this.selectedBudget) {
      this.validationError = 'الرجاء تحديد ميزانية تقريبية أولاً';
      return;
    }
    this.validationError = '';
    this.step++;
  }

  prev() {
    this.validationError = '';
    this.step--;
  }

  async submit() {
    // 1. فحص حماية من التكرار (Spam Protection - Cooldown)
    const lastSubmission = localStorage.getItem('lastSubmissionTime');
    if (lastSubmission) {
      const timeSinceLast = Date.now() - parseInt(lastSubmission, 10);
      const cooldownMs = 8 * 60 * 60 * 1000; // 8 ساعات
      
      if (timeSinceLast < cooldownMs) {
        // تحويله مباشرة للواتساب العادي بدلاً من منعه
        const text = `مرحباً، أود التحدث معكم بخصوص مشروعي.`;
        const url = `https://wa.me/201152597819?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        return;
      }
    }

    // 2. فحص صحة البيانات (Validation)
    if (!this.clientName.trim() || this.clientName.trim().length < 3) {
      this.validationError = 'يرجى كتابة اسم حقيقي (3 أحرف على الأقل)';
      return;
    }

    const cleanedPhone = this.clientPhone.replace(/[\s-]/g, '');
    // يقبل الأرقام الدولية والمحلية الصحيحة (من 7 إلى 15 رقم، مع إمكانية وجود + في البداية)
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      this.validationError = 'يرجى إدخال رقم واتساب صحيح';
      return;
    }

    if (!this.clientTime) {
      this.validationError = 'يرجى اختيار أفضل وقت للتواصل معك';
      return;
    }

    this.validationError = '';
    this.submitting = true;

    const formData = {
      name: this.clientName,
      phone: this.clientPhone,
      projectType: this.selectedProject,
      budget: this.selectedBudget,
      contactTime: this.clientTime,
      message: this.clientMessage,
    };

    try {
      // تجهيز رسالة الإشعار
      const text = `🚀 *طلب جديد من الموقع!* 🚀

👤 *الاسم:* ${this.clientName}
📞 *رقم العميل:* ${this.clientPhone}
💼 *نوع المشروع:* ${this.selectedProject}
💰 *الميزانية:* ${this.selectedBudget}
🕒 *الوقت المفضل:* ${this.clientTime}
📝 *رسالة:* ${this.clientMessage || 'لا يوجد'}`;

      // 1. إرسال الطلب إلى Formspree في الخلفية
      fetch('https://formspree.io/f/xwvybqor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Formspree Form Error:', err));

      // 2. إرسال إشعار تليجرام في الخلفية
      const telegramToken = '8087307735:AAEVnHKtvnlxEWePS6Ue81PWW6na8Zmp5zg';
      const chatId = '6785454741'; // المعرف الخاص بك
      const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
      
      fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram Error:', err));

      // حفظ وقت آخر إرسال ناجح لمنع التكرار (Spam)
      localStorage.setItem('lastSubmissionTime', Date.now().toString());

      this.submitting = false;
      this.submitted = true;
      
      // تصفير الفورم
      this.step = 1;
      this.selectedProject = '';
      this.selectedBudget = '';
      this.clientName = '';
      this.clientPhone = '';
      this.clientTime = '';
      this.clientMessage = '';
      
      setTimeout(() => this.submitted = false, 5000);
    } catch (error) {
      this.submitting = false;
      this.validationError = 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.';
    }
  }
}