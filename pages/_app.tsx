import type { AppProps } from "next/app";

import Layout from "../components/layout/Layout";
import AnimationProvider from "../components/animations/AnimationProvider";

import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <AnimationProvider>
        <Component {...pageProps} />
      </AnimationProvider>
    </Layout>
  );
}

export default MyApp;
