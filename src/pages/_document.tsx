import { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

const Document = () => {
  return (
    <Html lang="ja">
      <Head>
        <Script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossOrigin="anonymous" />
      </Head>
      <body className="min-h-[100dvh] min-h-screen bg-bgwhite text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
export default Document
