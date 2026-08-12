'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-md mx-auto rounded-cards border border-vellum bg-bone p-8 text-center space-y-5">
        <div className="text-3xl">⚠️</div>
        <div>
          <h1
            className="font-serif font-medium text-ink mb-2"
            style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
          >
            Something went wrong
          </h1>
          <p className="font-sans text-graphite mb-4" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            We encountered an unexpected error. Our team has been notified. Please try again in a moment.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full px-4 py-2 bg-ink text-bone rounded-cards font-sans font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
