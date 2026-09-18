export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  currency: string;
  balance?: number;
  created_at: string;
  updated_at: string;
}
