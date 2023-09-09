declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development';
      BOT_TOKEN: string;
      DATABASE_URL: string;
      SENTRY_DSN: string;
      GPT_API_KEY: string;
      PALM_API_KEY: string;
    }
  }
}

export {};
