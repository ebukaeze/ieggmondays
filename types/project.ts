export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  coverImage?: string;
  url?: string;
}
