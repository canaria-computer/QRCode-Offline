// src/utils/zxing-config.ts
import { getZXingModule, type ZXingModuleOverrides } from "zxing-wasm/reader";

export const prepareZXingReader = () => {
  const overrides: ZXingModuleOverrides = {
    locateFile: (path: string, prefix: string) => {
      if (path.endsWith(".wasm")) {
        return `/wasm/${path}`;
      }
      return prefix + path;
    }
  };

  return getZXingModule(overrides);
};
