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
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
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
