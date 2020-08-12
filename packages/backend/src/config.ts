import convict from 'convict';

interface Config {
  environment: 'production' | 'development';
  port: number;
  db: {
    uri: string;
  };
  jwt: {
    access: { secret: string; duration: string };
    refresh: { secret: string; duration: string };
  };
}

export const config = convict<Config>({
  environment: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to run the server on.',
    format: 'port',
    default: 4000,
    env: 'PORT'
  },
  db: {
    uri: {
      sensitive: true,
      doc: 'The mongodb uri.',
      format: String,
      default: 'does-not-matter-for-dev',
      env: 'MONGODB_URI'
    }
  },
  jwt: {
    refresh: {
      secret: {
        doc: 'The secret for the jwt tokens.',
        format: String,
        default: 'refresh-secret',
        sensitive: true,
        env: 'REFRESH_JWT_SECRET'
      },
      duration: {
        doc: 'How long the access token lasts for.',
        format: String,
        default: '7d',
        env: 'REFRESH_JWT_DURATION'
      }
    },
    access: {
      secret: {
        doc: 'The secret for the jwt tokens.',
        format: String,
        default: 'access-secret',
        sensitive: true,
        env: 'ACCESS_JWT_SECRET'
      },
      duration: {
        doc: 'How long the access token lasts for.',
        format: String,
        default: '15m',
        env: 'ACCESS_JWT_DURATION'
      }
    }
  }
});
