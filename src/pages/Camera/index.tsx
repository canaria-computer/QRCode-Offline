import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { prepareZXingModule, readBarcodes, ReadResult } from "zxing-wasm/reader";
import { addHistoryItem } from "../../utils/historyDB";

export default function Camera() {
  const [result, setResult] = createSignal<ReadResult | null>(null);
  const [isScanning, setIsScanning] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [copySuccess, setCopySuccess] = createSignal(false);
  let videoRef: HTMLVideoElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let scanInterval: number;

  // QRコード内容の種類を判定して適切なUI表示を返す関数
  const formatQRContent = (text: string) => {
    // URLパターン
    if (/^(https?:\/\/|www\.)/i.test(text)) {
      const url = text.startsWith("http") ? text : `https://${text}`;
      return (
        <section>
          <h3>URL検出</h3>
          <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
          <footer>
            <button onClick={() => window.open(url, "_blank")}>開く</button>
            <button onClick={() => handleCopy(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    // メールアドレス
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      return (
        <section>
          <h3>メールアドレス</h3>
          <a href={`mailto:${text}`}>{text}</a>
          <footer>
            <button onClick={() => window.location.href = `mailto:${text}`}>メール作成</button>
            <button onClick={() => handleCopy(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    // 電話番号
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(text.replace(/\s/g, ""))) {
      const cleanNumber = text.replace(/[^\d+]/g, "");
      return (
        <section>
          <h3>電話番号</h3>
          <a href={`tel:${cleanNumber}`}>{text}</a>
          <footer>
            <button onClick={() => window.location.href = `tel:${cleanNumber}`}>発信</button>
            <button onClick={() => handleCopy(text)}>コピー</button>
          </footer>
        </section>
      );
    }

    // その他のテキスト
    return (
      <section>
        <h3>テキスト</h3>
        <output>{text}</output>
        <footer>
          <button onClick={() => handleCopy(text)}>コピー</button>
        </footer>
      </section>
    );
  };

  // テキストをクリップボードにコピーする関数
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました", err);
    }
  };

  // ZXingモジュールの初期化
  onMount(async () => {
    try {
      await prepareZXingModule({
        overrides: {
          locateFile: (path: string, prefix: string) => {
            if (path.endsWith(".wasm")) {
              return `/wasm/${path}`;
            }
            return prefix + path;
          }
        },
        fireImmediately: true
      });
      console.log("ZXing module initialized");
    } catch (error) {
      console.error("Failed to initialize ZXing module:", error);
      setErrorMessage("QRコードスキャナーの初期化に失敗しました");
    }
  });

  // カメラ起動
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      if (videoRef) {
        videoRef.srcObject = stream;
        await videoRef.play();
        setIsScanning(true);
        setResult(null); // 新しいスキャン開始時に結果をリセット

        scanInterval = setInterval(scanQRCode, 500);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setErrorMessage("カメラへのアクセスに失敗しました");
    }
  };

  // スキャン停止
  const stopScanning = () => {
    if (videoRef && videoRef.srcObject) {
      const tracks = (videoRef.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.srcObject = null;
    }

    clearInterval(scanInterval);
    setIsScanning(false);
  };

  // QRコードスキャン処理
  const scanQRCode = async () => {
    if (!videoRef || !canvasRef || !isScanning()) return;

    const canvas = canvasRef;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return;

    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;

    context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const results = await readBarcodes(imageData);

      if (results && results.length > 0) {
        const scannedResult = results[0];
        setResult(scannedResult);

        // 履歴に保存
        canvas.toBlob(async (blob) => {
          if (!blob) throw new Error("Blob conversion failed");
          await addHistoryItem({
            image: blob,
            result: {
              text: scannedResult.text,
              format: scannedResult.format,
              position: scannedResult.position
            },
            timestamp: Date.now()
          });
        }, "image/jpeg", 0.7);

        stopScanning();
      }
    } catch (error) {
      console.error("Scanning error:", error);
    }
  };

  // 再スキャン処理
  const handleRescan = () => {
    setResult(null);
    startScanning();
  };

  onCleanup(() => {
    stopScanning();
  });

  return (
    <article>
      <header>
        <h2>QRコードスキャナー</h2>
      </header>

      <div class="controls">
        {!isScanning() && !result() ? (
          <button onClick={startScanning} class="flash attention">スキャン開始</button>
        ) : isScanning() ? (
          <button onClick={stopScanning} class="bg-attention">スキャン停止</button>
        ) : (
          <button onClick={handleRescan} class="accent">再スキャン</button>
        )}
      </div>

      <div class="scanner-container">
        <video
          ref={el => videoRef = el}
          autoplay
          playsinline
          hidden
        />
        <canvas
          ref={el => canvasRef = el}
          class={`scanner-canvas ${result() !== null ? "bd-success" : ""} ${result() === null && !isScanning() ? "muted" : ""}`}
        />
      </div>

      {errorMessage() && <output role="alert" class="error">{errorMessage()}</output>}

      <Show when={copySuccess()}>
        <div class="copy-notification bg-success">
          <span>コピーしました!</span>
        </div>
      </Show>

      {result() && (
        <div class="result">
          <header>
            <h3>スキャン結果</h3>
            <code>{result()?.format}</code>
          </header>

          {formatQRContent(result()!.text)}
        </div>
      )}
    </article>
  );
}
