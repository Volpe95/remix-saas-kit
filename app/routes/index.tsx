import Features from "~/components/front/Features";
import Footer from "~/components/front/Footer";
import Hero from "~/components/front/Hero";
import JoinNow from "~/components/front/JoinNow";
import i18next from "~/locale/i18n.server";
import { getUserInfo } from "~/utils/session.server";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import { ResourceLanguage } from "i18next";

export const meta: MetaFunction = () => ({
  title: "Remix SaasFrontend",
});

type LoaderData = {
  authenticated: boolean;
  i18next: Record<string, any>;
};

export let loader: LoaderFunction = async ({ request }) => {
  try {
    const userInfo = await getUserInfo(request);
    const data: LoaderData = {
      authenticated: (userInfo?.userId ?? "").length > 0,
      i18next: await i18next.getFixedT(request, ["translations"]),
    };
    return json(data);
  } catch (e) {
    console.error({
      error: e,
    });
    return json({
      i18next: await i18next.getFixedT(request, ["translations"]),
    });
  }
};

export default function IndexRoute() {
  return (
    <div>
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-slate-200">
        <Hero />
        <Features className="relative z-10" />
        <JoinNow />
        <Footer />
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>{`${caught.status} ${caught.statusText}`}</h1>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>App Error</h1>
      <pre>{JSON.stringify(error)}</pre>
    </div>
  );
}
