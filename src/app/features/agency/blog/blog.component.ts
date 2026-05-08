import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BLOG_DATA } from '../../../core/data/agency.data';
import { BlogPost } from '../../../core/models/agency.models';
import { GlassCardComponent } from '../../../shared/ui/glass-card/glass-card.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, GlassCardComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {
  allPosts = signal<BlogPost[]>(BLOG_DATA);
  selectedCategory = signal<string>('الكل');

  categories = computed(() => {
    const cats = new Set(this.allPosts().map(p => p.category).filter((c): c is string => !!c));
    return ['الكل', ...Array.from(cats)];
  });

  filteredPosts = computed(() => {
    if (this.selectedCategory() === 'الكل') {
      return this.allPosts();
    }
    return this.allPosts().filter(p => p.category === this.selectedCategory());
  });

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
