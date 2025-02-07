// 必要なコンポーネントやユーティリティをインポート
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react"; // アイコンコンポーネント
import { redirect } from "next/navigation"; // ページリダイレクト用

// protectedページのメインコンポーネント
// async をつけることで非同期処理（データベースとの通信など）が可能
export default async function ProtectedPage() {
  // Supabaseクライアントを作成（サーバー側で実行）
  const supabase = await createClient();

  // 現在ログインしているユーザーの情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザーがログインしていない場合（userがnull）
  // ログインページにリダイレクト
  if (!user) {
    return redirect("/sign-in");
  }

  // ページのメインコンテンツを返す
  return (
    // flex-1で残りの空間を埋める、w-fullで幅いっぱい
    // gap-12で要素間の間隔を設定
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* お知らせバナーセクション */}
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>

      {/* ユーザー詳細情報セクション */}
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        {/* ユーザー情報をJSON形式で表示 */}
        {/* pre タグで整形済みテキストとして表示 */}
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {/* 
            JSON.stringify(user, null, 2) の説明:
            - 第1引数: 変換するオブジェクト（ユーザー情報）
            - 第2引数: null（変換方法のカスタマイズ。通常はnull）
            - 第3引数: 2（インデントのスペース数）
          */}
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {/* 次のステップセクション */}
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        {/* 次のステップを表示するコンポーネント */}
        <FetchDataSteps />
      </div>
    </div>
  );
}