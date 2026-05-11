import { Component, input, signal, computed, effect, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NicheConfig, NicheStep, NicheOption } from '../../../core/data/niches.data';

@Component({
  selector: 'app-dynamic-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-widget.component.html',
  styleUrl: './dynamic-widget.component.css'
})
export class DynamicWidgetComponent {
  config = input.required<NicheConfig>();

  @HostBinding('style.--primary')
  get primaryColor() { return this.config().themeColor; }

  @HostBinding('style.--primary-glow')
  get primaryGlow() { 
    // Quick hex to rgba for glow effect
    const hex = this.config().themeColor;
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, 0.4)`;
  }

  currentStepIndex = signal<number>(0);
  state = signal<Record<string, any>>({});
  booked = signal(false);

  // Derived state
  currentStep = computed(() => {
    const idx = this.currentStepIndex();
    const steps = this.config().steps;
    return (idx >= 0 && idx < steps.length) ? steps[idx] : null;
  });

  isSummaryStep = computed(() => this.currentStepIndex() === this.config().steps.length);

  canProceed = computed(() => {
    const step = this.currentStep();
    if (!step) return false;
    
    const val = this.state()[step.id];
    
    if (step.type === 'grid' || step.type === 'list' || step.type === 'color-picker') {
      return val !== undefined && val !== null;
    }
    
    if (step.type === 'counter') {
      return typeof val === 'number';
    }
    
    if (step.type === 'form') {
      if (!val) return false;
      // All fields must have at least 2 chars
      return step.fields?.every(f => (val[f.id] || '').length > 2) ?? false;
    }
    
    return false;
  });

  summaryRows = computed(() => this.config().summary.generateRows(this.state()));
  
  total = computed(() => {
    if (this.config().summary.computeTotal) {
      return this.config().summary.computeTotal!(this.state());
    }
    return null;
  });

  // Since we reset on config change:
  constructor() {
    effect(() => {
      // Whenever config changes, reset state
      this.config(); // access to track
      this.reset();
    });
  }

  // --- Actions ---

  goNext() {
    if (this.canProceed()) {
      this.currentStepIndex.update(i => i + 1);
    }
  }

  goBack() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  setOption(stepId: string, option: NicheOption) {
    this.state.update(s => ({ ...s, [stepId]: option }));
  }

  setCounter(stepId: string, delta: number, min: number, max: number) {
    const current = this.state()[stepId] || min;
    const next = current + delta;
    if (next >= min && next <= max) {
      this.state.update(s => ({ ...s, [stepId]: next }));
    }
  }

  setFormField(stepId: string, fieldId: string, value: string) {
    const current = this.state()[stepId] || {};
    this.state.update(s => ({ ...s, [stepId]: { ...current, [fieldId]: value } }));
  }

  confirmAction() {
    const msg = this.config().summary.generateMessage(this.state(), this.total());
    const phone = this.config().summary.whatsappPhone;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    this.booked.set(true);
  }

  reset() {
    this.currentStepIndex.set(0);
    this.state.set({});
    
    // Initialize counters
    this.config().steps.forEach(s => {
      if (s.type === 'counter' && s.counter) {
        this.state.update(state => ({ ...state, [s.id]: s.counter!.min }));
      }
    });

    this.booked.set(false);
  }
}
