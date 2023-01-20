import styles from "./styles/app.css";
//import { useSetupTranslations } from "remix-i18next";
import { createUserSession, getUserInfo } from "./utils/session.server";
import { loadRootData, useRootData } from "./utils/data/useRootData";
import TopBanner from "./components/ui/banners/TopBanner";
import { ActionFunction, json, LinksFunction, LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
//import { useChangeLanguage } from "remix-i18next";
import i18next from "~/locale/i18n.server";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export function useChangeLanguage(locale: string) {
  let { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export let handle = {
  i18n: "translations",
};

//export async function loader({ request }: LoaderArgs) {
//  let locale = await i18next.getLocale(request);
//  return json({ locale });
//}

export const meta: MetaFunction = () => {
  const description = `Remix SaaS kit with everything you need to start your SaaS app.`;
  return {
    charset: "utf-8",
    description,
    keywords: "Remix,saas,tailwindcss,typescript,starter",
    "og:image": "https://yahooder.sirv.com/saasfrontends/remix/ss/cover.png",
    "og:card": "summary_large_image",
    "og:creator": "@AlexandroMtzG",
    "og:site": "https://saasfrontends.com",
    "og:title": "Remix SaaS kit",
    "og:description": description,
    "twitter:image": "https://yahooder.sirv.com/saasfrontends/remix/remix-thumbnail.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@AlexandroMtzG",
    "twitter:site": "@SaasFrontends",
    "twitter:title": "Remix SaaS kit",
    "twitter:description": description,
  };
};

function Document({ children, title = `Remix SaasFrontend` }: { children: React.ReactNode; title?: string }) {
  const data = useRootData();
 
  // Get the locale from the loader
  //let { locale } = useLoaderData<typeof loader>() as any;
  let { i18n } = useTranslation();  

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(data.locale);

  return (
    <html lang={data?.locale} dir={i18n.dir()} className={data?.lightOrDarkMode === "dark" ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Links />
      </head>
      <body className="min-h-screen text-gray-800 dark:text-white bg-white dark:bg-slate-900 max-w-full max-h-full">
        <TopBanner />
        {children}
        <Scripts />
        <LiveReload />
        <ScrollRestoration />

        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        <noscript>
          <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" />
        </noscript>
      </body>
    </html>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  return loadRootData(request);
};

export const action: ActionFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const type = form.get("type");
  const redirect = form.get("redirect")?.toString();
  if (type === "toggleLightOrDarkMode") {
    const current = userInfo?.lightOrDarkMode ?? "dark";
    const lightOrDarkMode = current === "dark" ? "light" : "dark";
    return createUserSession(
      {
        userId: userInfo?.userId ?? "",
        currentTenantId: userInfo?.currentTenantId ?? "",
        currentWorkspaceId: userInfo?.currentWorkspaceId ?? "",
        // locale: userInfo?.currentWorkspaceId ?? "en",
        lightOrDarkMode,
      },
      redirect
    );
  }
  if (type === "setLocale") {
    return createUserSession(
      {
        userId: userInfo?.userId,
        currentTenantId: userInfo?.currentTenantId,
        currentWorkspaceId: userInfo?.currentWorkspaceId,
        lightOrDarkMode: userInfo?.lightOrDarkMode,
      },
      redirect
    );
  }
};

export default function App() {

  let { locale } = useLoaderData<{ locale: string }>();
  //useSetupTranslations(locale);

  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div>
        <h1>App Error</h1>
        <pre>{JSON.stringify(error)}</pre>
      </div>
    </Document>
  );
}
