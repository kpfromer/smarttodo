/* eslint-disable */
const path = require('path');

module.exports = {
  apps: [
    {
      name: 'index',
      script: path.join(__dirname, 'lib/index.js'),
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
