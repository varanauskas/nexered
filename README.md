# NEXERED

Support Next.js redirects in your hosting provider

---

[Next.js redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects)
defined in `next.config.js` do not work in static HTML exports.

However, in many hosting providers (for example Cloudflare Pages) it is possible
to define a static redirect config (for example `_redirects` file).

This package aims to parse existing `next.config.js` and automatically define
configuration for those third party hosting providers.

## Get started

1. Install `nexered` using your package manager
    ```sh
    yarn add nexered
    ```
    or if you're using `npm`
    ```sh
    npm install nexered
    ```

2. Add `nexered` to the `postbuild` [(or the `post-` script of the static export script if it's named differently)](https://docs.npmjs.com/cli/v6/using-npm/scripts#pre--post-scripts) step in `package.json`
    ```diff
    {
        "scripts": {
            "postbuild": "nexered --provider=cloudflare-pages"
        }
    }
    ```

3. ...

4. Profit

## Supported providers

- [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/redirects/)

    Supports `:wildcards*` and `:slugs` and same status codes as next.js
    
    Example:
    ```js
    // next.config.js
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        basePath: "/base-path",
        async redirects() {
            return [
                {
                    source: '/old-page',
                    destination: '/new-page',
                    permanent: true,
                },
                {
                    source: '/old-wildcard/:path*',
                    destination: '/new-wildcard/:path*',
                    permanent: false
                },
                {
                    source: '/old-blog/:slug',
                    destination: '/new-blog/:slug',
                    permanent: true,
                },
                {
                    source: '/without-base-path',
                    destination: '/absolute-path',
                    basePath: false,
                    permanent: false,
                },
                {
                    source: '/custom-status-code',
                    destination: '/status-code-303',
                    statusCode: 303
                }
            ];
        },
    };

    module.exports = nextConfig;
    ```

    ```
    // out/_redirects
    /base-path/old-page /base-path/new-page 308
    /base-path/old-wildcard/* /base-path/new-wildcard/:splat 307
    /base-path/old-blog/:slug /base-path/new-blog/:slug 308
    /without-base-path /absolute-path 307
    /base-path/custom-status-code /base-path/status-code-303 303
    ```

## Usage
```
nexered --p=cloudflare-pages

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -p, --provider  hosting provider type [required] [choices: "cloudflare-pages"]
  -o              `next export` output directory as described in
                  https://nextjs.org/docs/api-reference/next.config.js/exportPat
                  hMap#customizing-the-output-directory[string] [default: "out"]
      --dir       next project directory containing `next.config.js`
                                                         [string] [default: "."]
```