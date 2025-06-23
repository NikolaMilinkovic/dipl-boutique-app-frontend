/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // add other vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
