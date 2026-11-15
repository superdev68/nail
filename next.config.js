/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["vi", "en"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: ["salonhero-wasabi.becdn.net", "cdn.sanity.io"],
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
};

module.exports = nextConfig;
