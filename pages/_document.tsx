import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Đặt lịch hẹn nhanh chóng và thuận tiện dành riêng cho khách hàng của Nail Room - Mit’s House. Hãy đặt lịch để được chăm sóc và hỗ trợ tốt nhất."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Roboto:wght@700&display=swap"
        />
        <link
          rel="icon"
          href="https://salonhero-wasabi.becdn.net/Others/559/559-80fa0j3n05s0-300x300.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
