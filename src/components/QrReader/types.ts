export interface QRResult {
  text: string;
  format: string;
  position: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export type QRError = {
  type: "FORMAT_ERROR" | "DECODE_ERROR";
  message: string;
};
