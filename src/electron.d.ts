// src/electron.d.ts
export interface Api {
  dbQuery: (query: string, params: any[]) => Promise<any>;
}

declare global {
  interface Window {
    api: Api;
  }
}