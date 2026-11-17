/** @type {import('next').NextConfig} */

const isExport = process.env.NEXT_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["salonhero-wasabi.becdn.net", "cdn.sanity.io"],
    ...(isExport ? { unoptimized: true } : {}),
  },
  webpack: function (config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      buffer: false,
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      buffer: false,
    };
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 500000,
          name: "[name].[ext]",
        },
      },
    });
    return config;
  },
  ...(isExport
    ? {
        basePath,
        assetPrefix: basePath ? `${basePath}/` : "",
        trailingSlash: true,
      }
    : {
        i18n: {
          locales: ["vi", "en"],
          defaultLocale: "en",
          localeDetection: false,
        },
      }),
};

module.exports = nextConfig;
