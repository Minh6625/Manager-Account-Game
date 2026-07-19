import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-secondary p-4">
      {/* Primary brand strip — industrial navy like ecom top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-1 bg-primary" />
      <LoginForm />
    </div>
  );
}
