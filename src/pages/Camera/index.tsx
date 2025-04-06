import { createSignal, onMount, onCleanup } from "solid-js";
import { prepareZXingModule, readBarcodes, ReadResult } from "zxing-wasm/reader";
import { addHistoryItem } from "../../utils/historyDB";

export default function Camera() {
  const [result, setResult] = createSignal<ReadResult | null>(null);
  const [isScanning, setIsScanning] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  let videoRef: HTMLVideoElement | undefined;;
  let canvasRef: HTMLCanvasElement | undefined;
  let scanInterval: number;

  // ZXingモジュールの初期化
  onMount(async () => {
    try {
      await prepareZXingModule({
        overrides: {
          locateFile: (path: string, prefix: string) => {
            // WASMファイルの場所を指定
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

  onCleanup(() => {
    stopScanning();
  });

  return (
    <>
      <h2>QRコードスキャナー</h2>
      <div>
        {!isScanning() ? (
          <button onClick={startScanning} class="flash attention">スキャン開始</button>
        ) : (
          <button onClick={stopScanning} class="bg-attention">スキャン停止</button>
        )}
      </div>

      <>
        <video
          ref={el => videoRef = el}
          autoplay
          playsinline
          hidden
        />
        <canvas
          ref={el => canvasRef = el}
          class={`${result() !== null ? "bd-success" : ""} ${result() === null && !isScanning() ? "muted" : ""}`}
        />
      </>
      {errorMessage() && <p class="error">{errorMessage()}</p>}
      {result() && (
        <div class="result">
          <h2>スキャン結果:</h2>
          <p>形式: {result()?.format}</p>
          <p>内容: <output>{result()?.text}</output></p>
        </div>
      )}

    </>
  );
}
