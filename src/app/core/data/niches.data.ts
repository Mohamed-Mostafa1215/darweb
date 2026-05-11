export type StepType = 'grid' | 'list' | 'counter' | 'form' | 'color-picker';

export interface NicheOption {
  id: string;
  label: string;
  icon?: string;
  price?: number;
  colorHex?: string;
}

export interface NicheStep {
  id: string;
  title: string;
  navLabel: string;
  type: StepType;
  options?: NicheOption[];
  fields?: { id: string; placeholder: string; type?: string }[];
  counter?: { min: number; max: number; step: number; unit: string; pricePerUnit?: number };
}

export interface NicheConfig {
  id: string;
  themeColor: string;
  icon: string;
  title: string;
  subtitle: string;
  steps: NicheStep[];
  summary: {
    title: string;
    totalLabel?: string;
    ctaText: string;
    whatsappPhone: string;
    computeTotal?: (state: any) => number | string | null;
    generateMessage: (state: any, total: any) => string;
    generateRows: (state: any) => { label: string; value: string }[];
  };
}

export const NICHES: NicheConfig[] = [
  // 1. Clinic
  {
    id: 'clinic',
    themeColor: '#a78bfa', // Purple
    icon: '🩺',
    title: 'عيادة سمايل',
    subtitle: 'نظام حجز المواعيد',
    steps: [
      { id: 'service', navLabel: 'الخدمة', title: 'اختر الخدمة الطبية', type: 'grid', options: [
        { id: 'checkup', label: 'كشف وتنظيف', icon: '🦷' },
        { id: 'cosmetic', label: 'تجميل الأسنان', icon: '✨' },
        { id: 'braces', label: 'تقويم', icon: '😁' },
        { id: 'root', label: 'علاج جذور', icon: '🔧' }
      ]},
      { id: 'time', navLabel: 'الموعد', title: 'اختر الموعد المناسب', type: 'list', options: [
        { id: 't1', label: 'السبت - 5:00 م' },
        { id: 't2', label: 'الأحد - 7:00 م' },
        { id: 't3', label: 'الاثنين - 3:00 م' },
      ]}
    ],
    summary: {
      title: 'ملخص الحجز',
      ctaText: 'تأكيد الحجز عبر واتساب',
      whatsappPhone: '201000000000',
      generateRows: (state) => [
        { label: 'الخدمة', value: state['service']?.label || '' },
        { label: 'الموعد', value: state['time']?.label || '' }
      ],
      generateMessage: (state) => `🩺 حجز موعد عيادة\n\nالخدمة: ${state['service']?.label}\nالموعد: ${state['time']?.label}\n\nأرغب بتأكيد الحجز!`
    }
  },

  // 2. Ecommerce
  {
    id: 'ecommerce',
    themeColor: '#f59e0b', // Amber
    icon: '👟',
    title: 'متجر سنيكرز',
    subtitle: 'شراء بضغطة زر',
    steps: [
      { id: 'color', navLabel: 'اللون', title: 'اختر اللون', type: 'color-picker', options: [
        { id: 'black', label: 'أسود', colorHex: '#111' },
        { id: 'white', label: 'أبيض', colorHex: '#eee' },
        { id: 'blue', label: 'كحلي', colorHex: '#1e3a8a' },
      ]},
      { id: 'size', navLabel: 'المقاس', title: 'اختر المقاس', type: 'grid', options: [
        { id: '41', label: '41' }, { id: '42', label: '42' }, { id: '43', label: '43' }, { id: '44', label: '44' }
      ]},
      { id: 'shipping', navLabel: 'الشحن', title: 'بيانات التوصيل', type: 'form', fields: [
        { id: 'name', placeholder: 'الاسم بالكامل', type: 'text' },
        { id: 'phone', placeholder: 'رقم الموبايل', type: 'tel' }
      ]}
    ],
    summary: {
      title: 'ملخص الطلب (سنيكرز برو)',
      totalLabel: 'الإجمالي:',
      ctaText: 'تأكيد الطلب',
      whatsappPhone: '201000000000',
      computeTotal: () => 1250,
      generateRows: (state) => [
        { label: 'اللون', value: state['color']?.label || '' },
        { label: 'المقاس', value: state['size']?.label || '' },
        { label: 'المستلم', value: state['shipping']?.name || '' }
      ],
      generateMessage: (state, total) => `🛍️ طلب جديد\nالمنتج: سنيكرز برو\nاللون: ${state['color']?.label}\nالمقاس: ${state['size']?.label}\n\nالاسم: ${state['shipping']?.name}\nالموبايل: ${state['shipping']?.phone}\n\nالإجمالي: ${total} ج.م`
    }
  },

  // 3. Decor
  {
    id: 'decor',
    themeColor: '#10b981', // Emerald
    icon: '🛋️',
    title: 'آرت ديكور',
    subtitle: 'حاسبة تشطيبات دقيقة',
    steps: [
      { id: 'type', navLabel: 'العقار', title: 'نوع العقار', type: 'grid', options: [
        { id: 'apt', label: 'شقة', icon: '🏢' },
        { id: 'villa', label: 'فيلا', icon: '🏡' },
      ]},
      { id: 'area', navLabel: 'المساحة', title: 'المساحة (بالمتر المربع)', type: 'counter', counter: { min: 50, max: 1000, step: 10, unit: 'متر' } },
      { id: 'style', navLabel: 'الستايل', title: 'ستايل التشطيب', type: 'list', options: [
        { id: 'modern', label: 'مودرن', price: 3000 },
        { id: 'classic', label: 'كلاسيك', price: 4500 }
      ]}
    ],
    summary: {
      title: 'التكلفة التقديرية',
      totalLabel: 'التكلفة:',
      ctaText: 'حجز موعد للمعاينة',
      whatsappPhone: '201000000000',
      computeTotal: (state) => (state['area'] || 0) * (state['style']?.price || 0),
      generateRows: (state) => [
        { label: 'النوع', value: state['type']?.label || '' },
        { label: 'المساحة', value: `${state['area']} متر` },
        { label: 'الستايل', value: state['style']?.label || '' }
      ],
      generateMessage: (state, total) => `🛠️ تسعير تشطيب\nالنوع: ${state['type']?.label}\nالمساحة: ${state['area']} متر\nالستايل: ${state['style']?.label}\nالتكلفة التقريبية: ${total} ج.م\nأرغب بمعاينة الموقع!`
    }
  },

  // 4. Trade
  {
    id: 'trade',
    themeColor: '#3b82f6', // Blue
    icon: '🤝',
    title: 'عربون بلس',
    subtitle: 'دفع إلكتروني آمن (Escrow)',
    steps: [
      { id: 'role', navLabel: 'الطرف', title: 'أنا في هذه المعاملة:', type: 'grid', options: [
        { id: 'buyer', label: 'مشتري', icon: '💳' },
        { id: 'seller', label: 'بائع', icon: '📦' }
      ]},
      { id: 'deal', navLabel: 'المعاملة', title: 'تفاصيل المعاملة', type: 'form', fields: [
        { id: 'item', placeholder: 'اسم المنتج/الخدمة', type: 'text' },
        { id: 'price', placeholder: 'السعر (ج.م)', type: 'number' }
      ]}
    ],
    summary: {
      title: 'ملخص المعاملة',
      totalLabel: 'الإجمالي (مع الرسوم):',
      ctaText: 'إنشاء رابط ومشاركة',
      whatsappPhone: '201000000000',
      computeTotal: (state) => {
        const p = Number(state['deal']?.price) || 0;
        return p + (p * 0.02); // 2% fee
      },
      generateRows: (state) => [
        { label: 'دوري', value: state['role']?.label || '' },
        { label: 'المنتج', value: state['deal']?.item || '' },
        { label: 'القيمة الأصلية', value: `${state['deal']?.price || 0} ج.م` }
      ],
      generateMessage: (state, total) => `🤝 معاملة آمنة جديدة\nالطرف: ${state['role']?.label}\nالمنتج: ${state['deal']?.item}\nالقيمة: ${state['deal']?.price}\n\nالرابط للدفع/الاستلام: https://arboon.me/pay/mock-1234`
    }
  },

  // 5. Real Estate
  {
    id: 'realestate',
    themeColor: '#eab308', // Yellow
    icon: '🏢',
    title: 'سكاي لاين',
    subtitle: 'ابحث عن منزل أحلامك',
    steps: [
      { id: 'type', navLabel: 'الوحدة', title: 'نوع العقار', type: 'grid', options: [
        { id: 'villa', label: 'فيلا', icon: '🏡' },
        { id: 'apt', label: 'شقة', icon: '🏢' },
        { id: 'chalet', label: 'شاليه', icon: '🏖️' }
      ]},
      { id: 'budget', navLabel: 'الميزانية', title: 'الميزانية التقريبية', type: 'list', options: [
        { id: 'b1', label: 'أقل من 3 مليون' },
        { id: 'b2', label: '3 - 5 مليون' },
        { id: 'b3', label: 'أكثر من 5 مليون' }
      ]}
    ],
    summary: {
      title: 'نتائج البحث',
      ctaText: 'التحدث لمستشار عقاري VIP',
      whatsappPhone: '201000000000',
      computeTotal: () => '14 وحدة متوفرة!',
      generateRows: (state) => [
        { label: 'نوع الوحدة', value: state['type']?.label || '' },
        { label: 'الميزانية', value: state['budget']?.label || '' }
      ],
      generateMessage: (state) => `🏢 طلب عقار VIP\nالوحدة: ${state['type']?.label}\nالميزانية: ${state['budget']?.label}\n\nأرغب باستلام البروشور وتحديد موعد للزيارة!`
    }
  },

  // 6. Marble (مواد البناء)
  {
    id: 'marble',
    themeColor: '#64748b', // Slate
    icon: '🏭',
    title: 'روك ستون',
    subtitle: 'حاسبة مقاسات الرخام والزجاج',
    steps: [
      { id: 'material', navLabel: 'الخامة', title: 'اختر الخامة', type: 'list', options: [
        { id: 'm1', label: 'رخام جلالة فص', price: 450 },
        { id: 'm2', label: 'جرانيت دبل بلاك', price: 1200 },
        { id: 'm3', label: 'زجاج سيكوريت 10مم', price: 850 }
      ]},
      { id: 'area', navLabel: 'المقاس', title: 'المساحة الإجمالية', type: 'counter', counter: { min: 1, max: 500, step: 1, unit: 'متر مربع' } }
    ],
    summary: {
      title: 'المقايسة المبدئية',
      totalLabel: 'التكلفة الإجمالية:',
      ctaText: 'أرسل المقايسة للمصنع',
      whatsappPhone: '201000000000',
      computeTotal: (state) => (state['area'] || 0) * (state['material']?.price || 0),
      generateRows: (state) => [
        { label: 'الخامة', value: state['material']?.label || '' },
        { label: 'الكمية', value: `${state['area']} متر` },
        { label: 'سعر المتر', value: `${state['material']?.price} ج.م` }
      ],
      generateMessage: (state, total) => `🏭 طلب توريد\nالخامة: ${state['material']?.label}\nالكمية: ${state['area']} متر\nالتكلفة التقريبية: ${total} ج.م\n\nالرجاء تأكيد الطلبية!`
    }
  },

  // 7. Spare Parts (مخازن وتوريدات)
  {
    id: 'spareparts',
    themeColor: '#ef4444', // Red
    icon: '⚙️',
    title: 'أوتو بارتس',
    subtitle: 'طلبيات الجملة السريعة',
    steps: [
      { id: 'product', navLabel: 'القطعة', title: 'حدد المنتج', type: 'list', options: [
        { id: 'p1', label: 'تيل فرامل نيسان صني', price: 350 },
        { id: 'p2', label: 'طقم بوجيهات NGK', price: 400 },
        { id: 'p3', label: 'فلتر زيت أصلي', price: 120 }
      ]},
      { id: 'qty', navLabel: 'الكمية', title: 'الكمية المطلوبة (بالقطعة/طقم)', type: 'counter', counter: { min: 1, max: 1000, step: 5, unit: 'قطعة' } }
    ],
    summary: {
      title: 'فاتورة الطلبية',
      totalLabel: 'الإجمالي (سعر الجملة):',
      ctaText: 'تأكيد الطلبية للمخزن',
      whatsappPhone: '201000000000',
      computeTotal: (state) => {
        let price = state['product']?.price || 0;
        let qty = state['qty'] || 0;
        // Discount for bulk (>20)
        if (qty >= 20) price = price * 0.85; 
        return price * qty;
      },
      generateRows: (state) => [
        { label: 'المنتج', value: state['product']?.label || '' },
        { label: 'الكمية', value: `${state['qty']} قطعة` },
        { label: 'ملاحظة', value: (state['qty'] >= 20) ? 'تم تطبيق خصم الجملة (15%)' : 'سعر قطاعي' }
      ],
      generateMessage: (state, total) => `⚙️ طلبية مخزن\nالمنتج: ${state['product']?.label}\nالكمية: ${state['qty']}\nالإجمالي: ${total} ج.م\n\nأرغب بتجهيز الطلبية للاستلام!`
    }
  },

  // 8. Printing (مطابع وتغليف)
  {
    id: 'printing',
    themeColor: '#ec4899', // Pink
    icon: '📦',
    title: 'برينت أون',
    subtitle: 'تسعير المطبوعات والتغليف',
    steps: [
      { id: 'type', navLabel: 'المنتج', title: 'نوع المطبوعات', type: 'grid', options: [
        { id: 'box', label: 'علب كرتون', icon: '🥡' },
        { id: 'bag', label: 'أكياس ورقية', icon: '🛍️' },
        { id: 'flyer', label: 'فلاير/بروشور', icon: '📄' }
      ]},
      { id: 'qty', navLabel: 'الكمية', title: 'الكمية', type: 'list', options: [
        { id: 'q1', label: '1000 قطعة', price: 1000 },
        { id: 'q2', label: '5000 قطعة', price: 4000 },
        { id: 'q3', label: '10000 قطعة', price: 7000 }
      ]},
      { id: 'colors', navLabel: 'الطباعة', title: 'ألوان الطباعة', type: 'list', options: [
        { id: 'c1', label: 'لون واحد', price: 0 },
        { id: 'c4', label: '4 ألوان (Full Color)', price: 1500 }
      ]}
    ],
    summary: {
      title: 'عرض السعر',
      totalLabel: 'التكلفة الإجمالية:',
      ctaText: 'اطلب الطباعة الآن',
      whatsappPhone: '201000000000',
      computeTotal: (state) => (state['qty']?.price || 0) + (state['colors']?.price || 0),
      generateRows: (state) => [
        { label: 'المنتج', value: state['type']?.label || '' },
        { label: 'الكمية', value: state['qty']?.label || '' },
        { label: 'الطباعة', value: state['colors']?.label || '' }
      ],
      generateMessage: (state, total) => `📦 طلب مطبوعات\nالمنتج: ${state['type']?.label}\nالكمية: ${state['qty']?.label}\nالألوان: ${state['colors']?.label}\nالسعر: ${total} ج.م\n\nأرغب في بدء التنفيذ!`
    }
  },

  // 9. Furniture (أثاث)
  {
    id: 'furniture',
    themeColor: '#8b5cf6', // Violet
    icon: '🪑',
    title: 'مودرن هوم',
    subtitle: 'صمم غرفتك السريعة',
    steps: [
      { id: 'room', navLabel: 'الغرفة', title: 'نوع الغرفة', type: 'grid', options: [
        { id: 'bed', label: 'غرفة نوم', icon: '🛏️' },
        { id: 'living', label: 'ركنة / صالون', icon: '🛋️' },
        { id: 'dining', label: 'سفرة', icon: '🍽️' }
      ]},
      { id: 'size', navLabel: 'المقاس', title: 'المقاس التقريبي', type: 'list', options: [
        { id: 's1', label: 'صغير (أقل من 3 متر)' },
        { id: 's2', label: 'وسط (3 لـ 5 متر)' },
        { id: 's3', label: 'كبير (أكثر من 5 متر)' }
      ]}
    ],
    summary: {
      title: 'التكلفة التقريبية',
      ctaText: 'حجز معاينة مهندس',
      whatsappPhone: '201000000000',
      computeTotal: (state) => {
        if(state['size']?.id === 's1') return '15,000 - 25,000 ج.م';
        if(state['size']?.id === 's2') return '25,000 - 40,000 ج.م';
        return 'تبدأ من 40,000 ج.م';
      },
      generateRows: (state) => [
        { label: 'الغرفة', value: state['room']?.label || '' },
        { label: 'المقاس', value: state['size']?.label || '' }
      ],
      generateMessage: (state, total) => `🪑 طلب تفصيل أثاث\nالغرفة: ${state['room']?.label}\nالمقاس: ${state['size']?.label}\nالرينج: ${total}\n\nأرغب في حجز معاينة وتصميم 3D!`
    }
  },

  // 10. Maintenance (صيانة)
  {
    id: 'maintenance',
    themeColor: '#0ea5e9', // Sky Blue
    icon: '🛠️',
    title: 'فيكس إت',
    subtitle: 'حجز صيانة سريع',
    steps: [
      { id: 'device', navLabel: 'الجهاز', title: 'نوع الجهاز', type: 'grid', options: [
        { id: 'ac', label: 'تكييف', icon: '❄️' },
        { id: 'elevator', label: 'مصعد', icon: '🛗' },
        { id: 'plumbing', label: 'سباكة', icon: '🚰' }
      ]},
      { id: 'issue', navLabel: 'العطل', title: 'نوع العطل', type: 'list', options: [
        { id: 'i1', label: 'لا يعمل نهائياً' },
        { id: 'i2', label: 'أصوات غريبة / تسريب' },
        { id: 'i3', label: 'صيانة دورية وتنظيف' }
      ]},
      { id: 'date', navLabel: 'الموعد', title: 'الموعد المناسب للزيارة', type: 'list', options: [
        { id: 'd1', label: 'اليوم (طوارئ)' },
        { id: 'd2', label: 'غداً' },
        { id: 'd3', label: 'خلال الأسبوع' }
      ]}
    ],
    summary: {
      title: 'طلب صيانة',
      totalLabel: 'رسوم الزيارة والكشف:',
      ctaText: 'تأكيد إرسال الفني',
      whatsappPhone: '201000000000',
      computeTotal: (state) => (state['date']?.id === 'd1') ? 350 : 200, // Emergency fee
      generateRows: (state) => [
        { label: 'الجهاز', value: state['device']?.label || '' },
        { label: 'العطل', value: state['issue']?.label || '' },
        { label: 'الموعد', value: state['date']?.label || '' }
      ],
      generateMessage: (state, total) => `🛠️ حجز صيانة\nالجهاز: ${state['device']?.label}\nالعطل: ${state['issue']?.label}\nالموعد: ${state['date']?.label}\nرسوم الزيارة: ${total} ج.م\n\nأرجو إرسال الفني في الموعد المحدد!`
    }
  }
];
