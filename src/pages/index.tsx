// src/pages/index.tsx
import { A } from "../router"

export default function Home() {
  return (
    <section>
      <h1>QRコードリーダーアプリケーション</h1>
      <p>本アプリケーションはSolid.jsとzxing-wasmを利用したQRコードリーダーです。</p>
      <A href="/QR-Reader" class="cta-button">リーダーを起動</A>
    </section>
  )
}
