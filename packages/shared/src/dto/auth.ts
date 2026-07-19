/** POST /api/v1/auth/login body */
export interface LoginDto {
  email: string;
  password: string;
}

/** POST /api/v1/auth/signup body */
export interface SignupDto {
  email: string;
  password: string;
  displayName: string;
}
