export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl: string;
  problem?: string;
  solution?: string;
  result?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  authorRole: string;
  image: string;
  city?: string;
  rating?: number;
}

export interface ContactForm {
  name: string;
  phone: string;
  projectType: string;
  budget: string;
  contactTime: string;
  message?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category?: string;
}
