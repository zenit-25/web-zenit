export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  url?: string;
  repoUrl?: string;
  image?: string;
  status: 'live' | 'in-progress' | 'coming-soon';
  accent: 'violet' | 'teal' | 'blue';
}
