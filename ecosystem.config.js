module.exports = {
  apps: [
    {
      name: 'Byte',
      script: './src/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
