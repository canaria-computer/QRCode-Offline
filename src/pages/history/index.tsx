import { createSignal, onMount, For } from "solid-js";
import { getAllHistoryItems, deleteHistoryItem, clearAllHistory, HistoryItem } from "../../utils/historyDB";

export default function History() {
  const [historyItems, setHistoryItems] = createSignal<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [deleteId, setDeleteId] = createSignal<number | null>(null);
  let deleteDialogRef!: HTMLDialogElement;
  let clearAllDialogRef!: HTMLDialogElement;

  // 履歴読み込み
  onMount(async () => {
    try {
      const items = await getAllHistoryItems();
      setHistoryItems(items);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("履歴の読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  });

  // 日付フォーマット
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("ja-JP");
  };

  // 削除ダイアログを表示
  const showDeleteDialog = (id: number) => {
    setDeleteId(id);
    deleteDialogRef.showModal();
  };

  // 全削除ダイアログを表示
  const showClearAllDialog = () => {
    clearAllDialogRef.showModal();
  };

  // 個別削除処理
  const handleDelete = async () => {
    const id = deleteId();
    if (id !== null) {
      try {
        await deleteHistoryItem(id);
        setHistoryItems(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error("Failed to delete history item:", err);
        setError("項目の削除に失敗しました");
      }
    }
  };

  // 全履歴削除処理
  const handleClearAll = async () => {
    try {
      await clearAllHistory();
      setHistoryItems([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      setError("履歴のクリアに失敗しました");
    }
  };

  return (
    <>
      <h2>スキャン履歴</h2>
      <button
        onClick={showClearAllDialog}
        disabled={historyItems().length === 0}
        class="fg-danger"
      >
        すべて削除
      </button>
      <hr />

      {error() && <output role="alert">{error()}</output>}

      {isLoading() ? (
        <output role="status">読み込み中...</output>
      ) : historyItems().length === 0 ? (
        <output role="status">履歴がありません</output>
      ) : (
        <table>
          <thead>
            <tr>
              <th>画像</th>
              <th>時刻</th>
              <th>種類</th>
              <th>内容</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <For each={historyItems()}>
              {(item) => (
                <tr>
                  <td>
                    <img
                      src={URL.createObjectURL(item.image)}
                      alt="スキャンしたQRコード"
                      onload={(e) => {
                        setTimeout(() => {
                          URL.revokeObjectURL(e.currentTarget.src);
                        }, 1000);
                      }}
                    />
                  </td>
                  <td>
                    <time datetime={new Date(item.timestamp).toISOString()}>
                      {formatDate(item.timestamp)}
                    </time>
                  </td>
                  <td>
                    <code>{item.result.format}</code>
                  </td>
                  <td>
                    <output>{item.result.text}</output>
                  </td>
                  <td>
                    <button
                      onClick={() => item.id && showDeleteDialog(item.id)}
                      class="fg-danger"
                    >
                      🚮削除
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      )}

      {/* 個別削除確認ダイアログ */}
      <dialog ref={deleteDialogRef}>
        <header>
          <h3>削除の確認</h3>
        </header>
        <p>この履歴項目を削除してもよろしいですか？</p>
        <footer>
          <form method="dialog">
            <button class="accent" onClick={handleDelete}>削除する</button>
            <button>キャンセル</button>
          </form>
        </footer>
      </dialog>

      {/* 全削除確認ダイアログ */}
      <dialog ref={clearAllDialogRef}>
        <header>
          <h3 class="danger">すべての履歴を削除</h3>
        </header>
        <p>履歴をすべて削除してもよろしいですか？この操作は元に戻せません。</p>
        <footer>
          <form method="dialog">
            <button class="danger" onClick={handleClearAll}>すべて削除する</button>
            <button>キャンセル</button>
          </form>
        </footer>
      </dialog>
    </>
  );
}
