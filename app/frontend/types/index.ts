export interface User {
  id: number;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export interface PageProps {
  user: User | null;
  errors: Record<string, string>;
  [key: string]: unknown;
}
