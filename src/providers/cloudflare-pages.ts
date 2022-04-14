import loadCustomRoutes from "next/dist/lib/load-custom-routes";
import { PERMANENT_REDIRECT_STATUS, TEMPORARY_REDIRECT_STATUS } from "next/dist/shared/lib/constants";
import type { AddProviderRedirects, NextRedirect } from "../types";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

type Paths = { source: string, destination: string };
function cloudflarePaths(paths: Paths): Paths {
    const { source, destination } = paths;
    const wildcardMatch = source.match(/(:[^\/]+\*)$/);
    if (!wildcardMatch || wildcardMatch.length === 0) return paths;
    const [wildcard] = wildcardMatch;
    return {
        source: source.replace(wildcard, '*'),
        destination: destination.replace(wildcard, ':splat')
    };
}

// https://developers.cloudflare.com/pages/platform/redirects/
function cloudflareRedirect({
    permanent,
    statusCode = permanent ? PERMANENT_REDIRECT_STATUS : TEMPORARY_REDIRECT_STATUS,
    ...redirect }: NextRedirect): string {
    const { source, destination } = cloudflarePaths(redirect);
    return `${source} ${destination} ${statusCode}`;
}

const cloudflareRedirects = (redirects: NextRedirect[]): string => redirects
    .map(cloudflareRedirect)
    .join('\n');

export const addRedirects: AddProviderRedirects = async (config, { outputDir }) => {
    const { redirects } = await loadCustomRoutes(config);
    const customRedirects = redirects.filter(redirect => !(redirect as { internal?: boolean }).internal);
    if (customRedirects.length === 0) return;
    await mkdir(outputDir, { recursive: true })
    await writeFile(join(outputDir, '/_redirects'), cloudflareRedirects(customRedirects), "ascii");
}
