import { FloatingNav } from '@/components/landing/floating-nav';
import { GrainOverlay } from '@/components/landing/grain-overlay';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-putty">
      <GrainOverlay />
      <FloatingNav variant="auth" />
      {children}
    </div>
  );
}
