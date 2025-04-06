import { A } from "../router"

export default function Home() {
  return (
    <section>
      <h2 class="pt-2">QRコードリーダーアプリケーション</h2>
      <p>オフラインでも利用できるシンプルなQRコードリーダーです。煩わしい広告はありません。利用料もかかりません。</p>
      <ul>
        <li>
          <A href="/Camera">QRCodeリーダーを開く</A>
        </li>
        <li>
          <A href="/QR-Reader">ファイルをアップロードして読み込む</A>
        </li>
      </ul>
      <h2 class="pt-2">履歴機能搭載</h2>
      <p>
        履歴機能があります。最大1000回の記録を保持します。<br />
        履歴はQRコードのスキャン結果、スキャンした画像、スキャン日時を保持します。
        <A href="/history">履歴を確認するにはこちら</A>
      </p>
    </section>
  )
}
