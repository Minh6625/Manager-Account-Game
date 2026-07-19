/** Public user shape returned by API (never includes passwordHash). */
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt?: string;
}
