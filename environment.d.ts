declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEV_BOT_TOKEN: string;
      PROD_BOT_TOKEN: string;
    }
  }
}

export {};
