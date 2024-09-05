/** @type {import('next').NextConfig} */
const nextConfig = {
//   webpack: (config) => {
//     // config.mudule.rules.push({
//     //   test: /\.mjs$/,
//     //   include: /node_modules/,
//     //   type: 'javascript/auto',
//     // });

//     return config;
//   },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
