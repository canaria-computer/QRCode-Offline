import { prepareZXingModule } from "zxing-wasm/reader";

export const initializeReader = async () => {
  await prepareZXingModule({
    overrides: {
      locateFile: () => "/wasm/zxing_reader.wasm",
    },
    equalityFn: Object.is,
    fireImmediately: true,
  });
};
