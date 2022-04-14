import loadConfig from "next/dist/server/config";
import { PHASE_EXPORT } from "next/dist/shared/lib/constants";
import { argv } from "./cli";
import * as CloudflareProvider from "./providers/cloudflare-pages";

export const providers = {
    "cloudflare-pages": CloudflareProvider
} as const;

export async function main(provider: keyof typeof providers, nextDir: string, outputDir: string) {
    const config = await loadConfig(PHASE_EXPORT, nextDir);
    providers[provider].addRedirects(config, { nextDir, outputDir });
}
