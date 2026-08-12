/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Strict Transport Security: Force HTTPS for all connections
          // max-age: 2 years (63072000 seconds)
          // includeSubDomains: Apply to all subdomains
          // preload: Allow browser preload lists to force HTTPS before first visit
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // X-Frame-Options: Prevent clickjacking attacks
          // SAMEORIGIN: Allow framing only from same origin (Clerk embedded forms need this)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // X-Content-Type-Options: Prevent MIME type sniffing
          // nosniff: Browser must respect Content-Type header, don't guess types
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-XSS-Protection: Legacy XSS filter (most browsers replaced with CSP, but good fallback)
          // 1; mode=block: Enable filter and block page if XSS detected
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer-Policy: Control what referrer info is sent to other sites
          // origin-when-cross-origin: Send full URL for same-origin, only origin for cross-origin
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Content-Security-Policy: Restrict resource loading to prevent XSS/injection attacks
          // default-src 'self': Only allow resources from same origin by default
          // script-src: Allow own scripts + Clerk auth scripts
          // style-src: Allow own styles + Google fonts (Clerk uses them)
          // font-src: Allow Google fonts (required by design system)
          // img-src: Allow images from self, data URLs, HTTPS (avatars)
          // connect-src: Allow API calls to self and Clerk
          // frame-src: Allow Clerk iframe widgets + Cloudflare challenges
          // object-src 'none': Disable plugins (Flash, etc.)
          // base-uri 'self': Restrict <base> tag to same origin
          // form-action 'self': Restrict form submissions to same origin
          // frame-ancestors 'none': Prevent embedding this app in other sites
          // upgrade-insecure-requests: Auto-upgrade HTTP to HTTPS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://api.clerk.com wss:",
              "frame-src 'self' https://challenges.cloudflare.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
