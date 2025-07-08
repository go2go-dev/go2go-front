/// <reference types="vite/client" />

// src/vite-env.d.ts 또는 src/global.d.ts 등
interface Window {
  postMessageToNative?: (message: any) => void;
}
