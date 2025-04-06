import { createSignal } from "solid-js";
import { readBarcodes } from "zxing-wasm/reader";
import type { QRResult, QRError } from "./types";

export default function QrReader() {
  const [result, setResult] = createSignal<QRResult | null>(null);
  const [error, setError] = createSignal<QRError | null>(null);

  const handleFile = async (file: File) => {
    try {
      const results = await readBarcodes(file);
      if (results.length === 0) {
        setError({ type: "DECODE_ERROR", message: "QRコードを検出できません" });
        return;
      }
      setResult(results[0]);
      setError(null);
    } catch {
      setError({
        type: "FORMAT_ERROR",
        message: "ファイル形式が不正です",
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error() && <div>{error()?.message}</div>}
      {result() && <pre>{JSON.stringify(result(), null, 2)}</pre>}
    </div>
  );
}
