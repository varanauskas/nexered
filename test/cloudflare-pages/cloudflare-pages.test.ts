import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { rm } from "fs/promises";
import { join } from "path";
import { main } from "../../src";

const EXPECTED = `/base/about /base 308
/base/old-blog/* /base/blog/:splat 307
/base/old-blog/:slug /base/news/:slug 308
/base/blog/* /base/news/:splat 308
/base/with-basePath /base/another 307
/without-basePath /another 307
/base/custom-status-code /base/status-code-303 303`;

describe("cloudflare provider", () => {
    let __NEXT_TEST_MODE: string | undefined;

    beforeAll(() => {
        __NEXT_TEST_MODE = process.env.__NEXT_TEST_MODE;
        process.env.__NEXT_TEST_MODE = 'jest';
    });

    afterAll(() => process.env.__NEXT_TEST_MODE = __NEXT_TEST_MODE);

    it("correctly populates _redirects file with redirects", async () => {
        const nextDir = join(__dirname, '/with-redirects');
        const outputDir = join(nextDir, '/out');
        await main('cloudflare-pages', nextDir, outputDir);
        const data = await readFile(join(outputDir, '/_redirects'), "ascii");
        expect(data).toEqual(EXPECTED);
        await rm(outputDir, { recursive: true, force: true });
    });

    it("does not create redirects if not necessary", async () => {
        const nextDir = join(__dirname, '/empty');
        const outputDir = join(nextDir, '/out');
        await main('cloudflare-pages', nextDir, outputDir);
        expect(await existsSync(join(outputDir, '/_redirects'))).toBe(false);
        await rm(outputDir, { recursive: true, force: true });
    });
});