import { createSignal, onMount, onCleanup } from "solid-js";
import { prepareZXingModule, readBarcodes } from "zxing-wasm/reader";
import type { ReadResult } from "zxing-wasm/reader";

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
        fireImmediately: true // 即時ロード
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
        video: { facingMode: "environment" } // 背面カメラを優先
      });

      if (videoRef) {
        videoRef.srcObject = stream;
        await videoRef.play();
        setIsScanning(true);

        // 定期的にフレームをキャプチャしてQRコードをスキャン
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

    // キャンバスサイズをビデオに合わせる
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;

    // ビデオフレームをキャンバスに描画
    context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    try {
      // キャンバスから画像データを取得
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // QRコードの読み取り
      const results = await readBarcodes(imageData);

      if (results && results.length > 0) {
        setResult(results[0]);
        stopScanning(); // QRコードが見つかったら停止（必要に応じてコメントアウト）
      }
    } catch (error) {
      console.error("Scanning error:", error);
    }
  };

  // コンポーネント破棄時のクリーンアップ
  onCleanup(() => {
    stopScanning();
  });

  return (
    <>
      <h1>QRコードスキャナー</h1>
      <div class="controls">
        {!isScanning() ? (
          <button onClick={startScanning}>スキャン開始</button>
        ) : (
          <button onClick={stopScanning}>スキャン停止</button>
        )}
      </div>

      <div>
        <video
          ref={el => videoRef = el}
          autoplay
          playsinline
          hidden
        ></video>
        <canvas
          ref={el => canvasRef = el}
        ></canvas>
      </div>
      {errorMessage() && <p class="error">{errorMessage()}</p>}
      {result() && (
        <div class="result">
          <h2>スキャン結果:</h2>
          <p>形式: {result()?.format}</p>
          <p>内容: {result()?.text}</p>
        </div>
      )}
    </>
  );
}
