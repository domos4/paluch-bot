const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { argv } = yargs(hideBin(process.argv))
  .command('crawl [pet]', 'crawl paluch for [pet]s', (yargs) => {
    yargs
      .positional('pet', {
        describe: 'dog or cat',
        choices: ['dog', 'cat'],
      });
  })
  .demandCommand(1, 1)
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .option('pages-count', {
    type: 'number',
    demandOption: true,
    default: 5,
    description: 'Number of "Na Paluchu" pages to fetch',
  });

const pet = argv._[0];

if (pet !== 'dog' && pet !== 'cat') {
  console.error(`pet must be either dog or cat, "${pet}" was given`);
  throw new Error();
}

module.exports = {
  ...argv,
  pet,
};
