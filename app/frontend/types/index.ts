import type { Page } from "@inertiajs/core";

export interface User {
  id: number;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export interface PageProps extends Page.Props {
  user: User | null;
  errors: Record<string, string>;
}
