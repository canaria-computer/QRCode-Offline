import { initializeReader } from "./qr";

export const measureWASMLoad = async () => {
  const start = performance.now();
  await initializeReader();
  const duration = performance.now() - start;
  console.log(`WASM load time: ${duration.toFixed(2)}ms`);
};
