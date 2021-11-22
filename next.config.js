/** @type {import('next').NextConfig} */

const path = require('path');

module.exports = {
  reactStrictMode: true,
  pageExtensions: ['route.tsx', 'route.ts'],

  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /~\/videos\/__compressed\/(.*).mp4/,
        path.join(process.cwd(), 'src/videos/__compressed'),
        {},
      )
    );

    config.module.rules.push({
      test: /\.bin$/i,
      type: 'asset/resource',

      generator: {
        // important, otherwise it will output into a folder that is not served by next
        filename: 'static/[hash][ext][query]'
      }
    });

    config.module.rules.push({
      test: /\.mp4/,
      type: 'asset/resource',

      generator: {
        // important, otherwise it will output into a folder that is not served by next
        filename: 'static/[hash][ext][query]'
      }
    });

    return config;
  },
}
