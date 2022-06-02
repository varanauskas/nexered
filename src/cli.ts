import yargs from "yargs";
import { main, providers } from ".";

const { argv } = yargs
    .usage('$0 --p=cloudflare-pages')
    .options({
        'p': { choices: Object.keys(providers) as (keyof typeof providers)[], demandOption: true, alias: 'provider', description: 'hosting provider type' },
        'o': { type: 'string', default: 'out', description: '`next export` output directory as described in https://nextjs.org/docs/api-reference/next.config.js/exportPathMap#customizing-the-output-directory' },
        'dir': { type: 'string', default: '.', description: 'next project directory containing `next.config.js`' }
    });

main(argv.p, argv.dir, argv.o)
    .catch(error => {
        console.error(error);
        process.exit(-1);
    });