import { MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import { useState } from "react";
import Nav from "../components/Nav";
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
          <Nav />
          <Component {...pageProps} />
        </SessionContextProvider>
      </MantineProvider>
    </Provider>
  );
}
export default MyApp;
