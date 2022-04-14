import type { NextConfig } from "next";
import type { NextConfigComplete } from "next/dist/server/config-shared";
export type NextRedirect = Awaited<ReturnType<Required<NextConfig>["redirects"]>>[number];
export type AddProviderRedirects = (config: NextConfigComplete, options: { outputDir: string, nextDir: string }) => Promise<void>;