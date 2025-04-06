// src/utils/qr.ts
import { getZXingModule } from "zxing-wasm/reader";

export const initializeReader = async () => {
  await getZXingModule({
    locateFile: () => "/wasm/zxing_reader.wasm",
  });
};
