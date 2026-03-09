import { Link } from 'react-router';
import { Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(255,68,68,0.1)] flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-[#FF4444]" />
        </div>
        <h1 className="text-[#F0F4FF] text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          404
        </h1>
        <h2 className="text-[#F0F4FF] text-xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-[#7A8FA6] mb-8">
          The page you're looking for doesn't exist in this identity vault.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-cta text-white font-semibold"
        >
          <Home className="w-5 h-5" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
