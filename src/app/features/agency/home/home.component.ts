import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlassCardComponent } from '../../../shared/ui/glass-card/glass-card.component';
import { AgencyService, Project } from '../../../core/services/agency.service';
import { LossCalculatorComponent } from './sections/loss-calculator/loss-calculator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, GlassCardComponent, LossCalculatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  projects: Project[] = [];
  currentSlide = 0;
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.agencyService.getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.projects = data;
        this.startAutoSlide();
        this.cdr.markForCheck();
      });
  }

  get currentProject(): Project | null {
    return this.projects.length ? this.projects[this.currentSlide] : null;
  }

  nextSlide() {
    if (this.projects.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.projects.length;
    this.cdr.markForCheck();
  }

  prevSlide() {
    if (this.projects.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.projects.length) % this.projects.length;
    this.cdr.markForCheck();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
    this.cdr.markForCheck();
  }

  private startAutoSlide() {
    this.slideInterval = setInterval(() => this.nextSlide(), 2500);
  }

  private resetAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startAutoSlide();
  }

  /** السلم — الخطوة 1: من Hero لحاسبة النزيف */
  scrollToCalculator() {
    document.getElementById('loss-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** السلم — الخطوة 2: من حاسبة النزيف للديمو (الانتقال للصفحة تم تحديثه في الحاسبة) */
  scrollToDemo() {
    this.router.navigate(['/demo']);
  }

  /** السلم — الخطوة 3: من الديمو لقسم الأسعار */
  scrollToPricing() {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** يحفظ الباقة المختارة وينتقل للاتصال */
  selectPackageAndScroll(packageType: string) {
    sessionStorage.setItem('selectedPackage', packageType);
    this.scrollToContact();
  }

  /** السلم — الخطوة 4: للـ Contact Wizard */
  scrollToContact() {
    this.router.navigate(['/contact']);
  }
}

