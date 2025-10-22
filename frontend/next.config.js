/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Docker
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configurações de produção
  compress: true,
  poweredByHeader: false,

  // Configurações de imagem
  images: {
    domains: ['localhost'],
  },

  // Configurações de API
  async rewrites() {
    // Fallback seguro para build-time
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Garante que o valor começa com http:// ou https://
    if (!/^https?:\/\//.test(apiUrl)) {
      console.warn(
        `[WARN] NEXT_PUBLIC_API_URL inválido (${apiUrl}). Usando fallback http://localhost:8080`
      );
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },

  // Configurações experimentais
  experimental: {
    // (Removidas opções obsoletas)
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
