import React, { useEffect } from "react";
import "../styles/globals.css";
import Layout from "../layout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useRouter } from "next/router";

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {};
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default App;
