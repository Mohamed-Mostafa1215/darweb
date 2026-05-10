import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import jsPDF from 'jspdf';

interface ThankYouState {
  clientName?: string;
  planTitle?: string;
  planPrice?: number;
  planCurrency?: string;
  orderId?: string;
}

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css'],
})
export class ThankYouComponent implements OnInit {
  state: ThankYouState = {};
  showConfetti = signal(false);

  steps = [
    { icon: '📋', title: 'مراجعة طلبك', desc: 'يراجع فريقنا تفاصيل طلبك وإيصال الدفع', time: 'خلال ساعة' },
    { icon: '📞', title: 'التواصل معك', desc: 'سيتصل بك مسؤول المشروع لتأكيد التفاصيل', time: 'خلال 24 ساعة' },
    { icon: '🚀', title: 'بدء التجهيز', desc: 'نبدأ فوراً في بناء وتجهيز نظامك', time: 'خلال 48 ساعة' },
  ];

  constructor(
    private router: Router,
    private titleService: Title,
    private meta: Meta
  ) {
    const nav = this.router.getCurrentNavigation();
    this.state = (nav?.extras?.state as ThankYouState) ?? {};
  }

  ngOnInit(): void {
    this.titleService.setTitle('تم الدفع بنجاح! — DarWeb');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    // Trigger confetti after short delay
    setTimeout(() => this.showConfetti.set(true), 300);
    setTimeout(() => this.showConfetti.set(false), 4000);
  }

  downloadReceipt(): void {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const date = new Date().toLocaleString('ar-EG');
    const orderId = this.state.orderId || `TXN-${Math.floor(Math.random() * 100000)}`;

    // Simple Receipt Design (Basic Text for now, as jsPDF needs fonts for Arabic)
    // Note: For full Arabic support in PDF, we usually need a custom font.
    // We will use standard labels but keep the data clear.
    
    doc.setFontSize(22);
    doc.text('DarWeb - Receipt', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 20, 40);
    doc.text(`Date: ${date}`, 20, 50);
    doc.line(20, 55, 190, 55);

    doc.text(`Client Name: ${this.state.clientName || 'Valued Customer'}`, 20, 70);
    doc.text(`Plan: ${this.state.planTitle || 'System Setup'}`, 20, 80);
    doc.text(`Amount: ${this.state.planPrice || 0} ${this.state.planCurrency || 'EGP'}`, 20, 90);
    doc.text('Status: Paid Successfully', 20, 100);

    doc.line(20, 110, 190, 110);
    doc.setFontSize(10);
    doc.text('Thank you for choosing DarWeb. Your project setup will begin shortly.', 105, 125, { align: 'center' });
    doc.text('darweb.com', 105, 135, { align: 'center' });

    doc.save(`DarWeb-Receipt-${orderId}.pdf`);
  }

  getWhatsAppLink(): string {
    const msg = encodeURIComponent(
      `مرحباً، تم دفع رسوم التجهيز لباقة "${this.state.planTitle ?? 'DarWeb'}". أريد متابعة إجراءات البدء.`
    );
    return `https://wa.me/201152597819?text=${msg}`;
  }
}
