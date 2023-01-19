import { getUserInfo } from "../session.server";
import i18next from "~/locale/i18n.server";
import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";

export type AppRootData = {
  locale: string;
  lightOrDarkMode: string;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}

export async function loadRootData(request: Request) {
  let locale = await i18next.getLocale(request);
  const userInfo = await getUserInfo(request);
  const data: AppRootData = {
    lightOrDarkMode: userInfo?.lightOrDarkMode ?? "dark",
    locale,
  };
  return json(data);
}
