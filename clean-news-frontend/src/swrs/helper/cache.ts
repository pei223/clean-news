import { Cache } from "swr";

const timestampExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// providerの初期化前に取得が走るため意味がない
export function localStorageProvider(): Cache {
  const map = new Map(
    JSON.parse(localStorage.getItem("app-cache") || "[]", (k, v) => {
      if (typeof v === "string" && timestampExp.test(v)) {
        return new Date(v);
      }
      return k;
    })
  );

  // アプリが終了する前に、すべてのデータを `localStorage` に保存します。
  window.addEventListener("beforeunload", () => {
    console.log("save cache");
    const appCache = JSON.stringify(Array.from(map.entries()), (k, v) => {
      if (v != null && typeof v.toISOString === "function") {
        return v.toISOString();
      }
      return v;
    });
    localStorage.setItem("app-cache", appCache);
  });

  // パフォーマンスのために、書き込みと読み取りには引き続き Map を使用します。
  return map as Cache;
}
