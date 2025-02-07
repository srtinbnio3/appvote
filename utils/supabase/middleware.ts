import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ユーザーのリクエストごとにセッションを更新する関数
export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // 元のリクエストの内容を保持したレスポンスを作成
    // これは後で必要に応じて修正される
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Supabaseクライアントを作成
    // 環境変数から接続情報を取得して初期化
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // Cookieの管理設定
        cookies: {
          // 現在のリクエストからすべてのCookieを取得
          getAll() {
            return request.cookies.getAll();
          },
          // 新しいCookieを設定する関数
          setAll(cookiesToSet) {
            // リクエストのCookieを更新
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            // レスポンスを新しく作成
            response = NextResponse.next({
              request,
            });
            // レスポンスのCookieも更新
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // 現在のユーザー情報を取得
    // セッションが期限切れの場合は自動的に更新される
    const user = await supabase.auth.getUser();

    // ルートの保護設定
    // /protected で始まるページにアクセスしようとして、
    // ユーザーが未ログインの場合（エラーがある場合）
    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      // ログインページにリダイレクト
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // トップページ（/）にアクセスしようとして、
    // ユーザーがログイン済みの場合（エラーがない場合）
    if (request.nextUrl.pathname === "/" && !user.error) {
      // protectedページにリダイレクト
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    // 上記以外の場合は通常のレスポンスを返す
    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
