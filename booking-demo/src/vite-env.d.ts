/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT: string;
  readonly VITE_CALENDAR_ID: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SHOWCASE_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
