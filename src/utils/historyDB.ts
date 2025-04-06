import { DatabaseFactory, DatabaseInterface, } from "@idxdb/promised";

const DB_NAME = "qr-scanner-history";
const DB_VERSION = 1;
const STORE_NAME = "scan-history";
const MAX_HISTORY_ITEMS = 1000;

export interface HistoryItem {
  id?: number;
  image: Blob;
  result: {
    text: string;
    format: string;
    position?: {
      topLeft: { x: number; y: number };
      bottomRight: { x: number; y: number };
    };
  };
  timestamp: number;
}

export const initDatabase = async () => {
  const migrations = [
    {
      version: 1,
      migration: async ({ db }: { db: DatabaseInterface }) => {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("timestamp_idx", "timestamp", { unique: false });
      },
    },
  ];

  return DatabaseFactory.open(DB_NAME, DB_VERSION, migrations);
};

export const addHistoryItem = async (item: Omit<HistoryItem, "id">) => {
  const db = await initDatabase();
  const tx = db.transaction([STORE_NAME], "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.add(item);

  const count = await store.count();
  if (count > MAX_HISTORY_ITEMS) {
    const timestampIndex = store.index("timestamp_idx");
    const cursor = timestampIndex.openCursor(undefined, "next");
    let deleteCount = count - MAX_HISTORY_ITEMS;

    while (!(await cursor.end()) && deleteCount > 0) {
      const key = cursor.primaryKey;
      if (key !== undefined) {
        await store.delete(key);
      }
      cursor.continue();
      deleteCount--;
    }
  }

  await tx.commit();
  db.close();
};

export const getAllHistoryItems = async (): Promise<HistoryItem[]> => {
  const db = await initDatabase();
  const tx = db.transaction([STORE_NAME], "readonly");
  const store = tx.objectStore(STORE_NAME);
  const timestampIndex = store.index("timestamp_idx");

  const items = await timestampIndex.getAll<HistoryItem, number>();
  db.close();
  return items.reverse();
};

export const deleteHistoryItem = async (id: number): Promise<void> => {
  const db = await initDatabase();
  const tx = db.transaction([STORE_NAME], "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.delete(id);
  await tx.commit();
  db.close();
};

export const clearAllHistory = async (): Promise<void> => {
  const db = await initDatabase();
  const tx = db.transaction([STORE_NAME], "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.clear();
  await tx.commit();
  db.close();
};
