import { A } from "../../router";
import { useLocation } from "@solidjs/router";
import favicon from "../../assets/favicon.svg";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "selected" : "";
  };

  return (
    <>
      <header class="mt-1">
        <hgroup class="p-1">
          <h1><img src={favicon} alt="" />シンプルQRコードリーダー</h1>
          <p>オフラインでも利用できるシンプルなQRコードリーダー。広告なし。</p>
        </hgroup>
        <A href="/">ホームへ戻る</A>
      </header>
      {location.pathname !== "/" && (
        <nav>
          <menu>
            <li class={isActive("/Camera")}>
              <A href="/Camera">カメラで読み取る</A>
            </li>
            <li class={isActive("/QR-Reader")}>
              <A href="/QR-Reader">ファイルをアップロード</A>
            </li>
            <li class={isActive("/history")}>
              <A href="/history">履歴</A>
            </li>
          </menu>
        </nav>
      )}
    </>
  );
}
