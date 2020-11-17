#!/usr/bin/env node

/* eslint-disable no-console */
const minimist = require('minimist');
const { execute, defaultOptions } = require('./update-ts-references');

const {
  cwd = defaultOptions.cwd,
  verbose = defaultOptions.verbose,
  help = defaultOptions.help,
  h = defaultOptions.help,
  discardComments = defaultOptions.discardComments,
  check = defaultOptions.check,
} = minimist(process.argv.slice(2));

if (help || h) {
  console.log(`
  Usage: update-ts-references [options]
  Options:
    --check       Checks if updates would be necessary (without applying them)
    --help        Show help
    --cwd         Set working directory. Default: ${defaultOptions.cwd}
    --discardComments     Discards comments when updating tsconfigs. Default: ${defaultOptions.discardComments}
    --verbose     Show verbose output. Default: ${defaultOptions.verbose}
  `);
  process.exit(0);
}

const run = async () => {
  try {
    const changesCount = await execute({
      cwd,
      verbose,
      discardComments,
      check,
    });

    if (check && changesCount > 0) {
      process.exit(changesCount);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();