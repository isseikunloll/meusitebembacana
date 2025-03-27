let userConfig;
try {
  userConfig = await import('./v0-user-next.config');
} catch {
  userConfig = {};
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Necessário para export estático
  },
  // Configurações para melhorar o desempenho do build
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Adicione estas configurações para melhor compatibilidade
  trailingSlash: true, // Recomendado para GitHub Pages
  // Configuração opcional para basePath se estiver em subdiretório
  // basePath: '/meu-repositorio',
  // Configuração para fallback de rotas
  skipTrailingSlashRedirect: true,
};

function mergeConfig(baseConfig, customConfig) {
  if (!customConfig) {
    return baseConfig;
  }

  return Object.keys(customConfig).reduce((acc, key) => {
    if (typeof acc[key] === 'object' && !Array.isArray(acc[key])) {
      acc[key] = { ...acc[key], ...customConfig[key] };
    } else {
      acc[key] = customConfig[key];
    }
    return acc;
  }, { ...baseConfig });
}

export default mergeConfig(nextConfig, userConfig);
