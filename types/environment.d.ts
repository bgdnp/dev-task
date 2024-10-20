export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'local' | 'cloud';
      CACHE_BUCKET_NAME: string;
    }
  }
}
