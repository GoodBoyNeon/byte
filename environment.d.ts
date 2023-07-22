declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      ENV: 'production' | 'development';
      DATABASE_URL: string;
    }
  }
}

export {};
