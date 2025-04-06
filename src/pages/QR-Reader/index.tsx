// src/pages/QR-Reader/index.tsx
import QrReader from "../../components/QrReader"

export default function QrReaderPage() {
  return (
    <div class="qr-reader-container">
      <h2>QRコードスキャナー</h2>
      <QrReader />
    </div>
  )
}
