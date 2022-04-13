import React from "react";
import Document, {Html, Head, Main, NextScript} from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>FYD</title>
          <link rel="icon" href={"/favicon.ico"} />
          <meta property="og:locale" content="en_EN" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
                rel="stylesheet" />
          <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" />
          <meta name="description"
                content="An example of a meta description. These show up in search engine results." />
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
  };
};

export default MyDocument;
