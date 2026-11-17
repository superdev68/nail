/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
