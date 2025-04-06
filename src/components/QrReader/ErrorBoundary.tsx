import { JSX, ErrorBoundary } from "solid-js";

export default function QrErrorBoundary(props: { children: JSX.Element }) {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <div class="error">
          <h2>システムエラー</h2>
          <p>{err.toString()}</p>
        </div>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
