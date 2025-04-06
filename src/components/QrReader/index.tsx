import { createSignal } from "solid-js";
import { readBarcodes } from "zxing-wasm/reader";
import type { QRResult, QRError } from "./types";

export default function QrReader() {
  const [result, setResult] = createSignal<QRResult | null>(null);
  const [error, setError] = createSignal<QRError | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const formatQRContent = (text: string) => {
    if (/^(https?:\/\/|www\.)/i.test(text)) {
      const url = text.startsWith("http") ? text : `https://${text}`;
      return (
        <section>
          <h3>URL検出</h3>
          <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
          <footer>
            <button onClick={() => window.open(url, "_blank")}>開く</button>
            <button onClick={() => navigator.clipboard.writeText(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      return (
        <section>
          <h3>メールアドレス</h3>
          <a href={`mailto:${text}`}>{text}</a>
          <footer>
            <button onClick={() => window.location.href = `mailto:${text}`}>メール作成</button>
            <button onClick={() => navigator.clipboard.writeText(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(text.replace(/\s/g, ""))) {
      const cleanNumber = text.replace(/[^\d+]/g, "");
      return (
        <section>
          <h3>電話番号</h3>
          <a href={`tel:${cleanNumber}`}>{text}</a>
          <footer>
            <button onClick={() => window.location.href = `tel:${cleanNumber}`}>発信</button>
            <button onClick={() => navigator.clipboard.writeText(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    return (
      <section>
        <h3>テキスト</h3>
        <output>{text}</output>
        <footer>
          <button onClick={() => navigator.clipboard.writeText(text)}>コピー</button>
        </footer>
      </section>
    );
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await readBarcodes(file);
      if (results.length === 0) {
        setError({ type: "DECODE_ERROR", message: "QRコードを検出できません" });
      } else {
        setResult(results[0]);
      }
    } catch {
      setError({
        type: "FORMAT_ERROR",
        message: "ファイル形式が不正です",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <label>
        <p>画像を選択:</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {isLoading() && <progress></progress>}

      {error() && <output role="alert">{error()?.message}</output>}

      {result() && (
        <section>
          <header>
            <h3>読み取り結果</h3>
            <aside><code>{result()?.format}</code></aside>
          </header>

          {formatQRContent(result()?.text || "")}
        </section>
      )}
    </>
  );
}
