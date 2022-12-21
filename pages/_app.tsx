import { MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import { useState } from "react";
import Footer from "../components/Footer";
import { HeaderResponsive } from "../components/Navbar";
import { RouterTransition } from "../components/RouterTransition";
import Provider from "../context/user";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <Provider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
        }}
      >
        <RouterTransition />
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}
        >
          <HeaderResponsive />
          <Component {...pageProps} />
          {/* <Footer /> */}
        </SessionContextProvider>
      </MantineProvider>
    </Provider>
  );
}
export default MyApp;
