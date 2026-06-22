#!/usr/bin/env node

/**
 * @file CLI entry point — wires the commands and parses arguments.
 *
 * Loads the registry, registers the `list` and `add` commands on a Commander
 * program, and parses `process.argv`. This file should stay thin — all command
 * logic lives in `src/commands/`.
 *
 * ## Usage
 *
 * ```bash
 * shared-packages list
 * shared-packages add <item-name> [--overwrite] [--skip-install]
 * shared-packages add                         # interactive toggle mode
 * ```
 */

import { Command } from 'commander';
import { multiselect, confirm, isCancel } from '@clack/prompts';
import { loadRegistry } from './registry/index';
import { listItems, addItem } from './commands/index';

/** Create the root CLI program and register all commands. */
const program = new Command();

const registry = loadRegistry();

program
  .name('shared-packages')
  .description('Install shared source files into a project.')
  .version(registry.version);

program
  .command('list')
  .description('List available registry items.')
  .action(() => {
    listItems(registry);
  });

program
  .command('add')
  .description('Copy registry items into the current project.')
  .argument('[item-name]', 'Registry item name (omit for interactive toggle)')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('--skip-install', 'Do not install item dependencies')
  .action(
    async (
      itemName: string | undefined,
      options: { overwrite?: boolean; skipInstall?: boolean },
    ) => {
      if (itemName) {
        const item = registry.items.find((entry) => entry.name === itemName);
        if (!item) {
          console.error(`Item "${itemName}" was not found.`);
          console.error('Run `shared-packages list` to see available items.');
          process.exitCode = 1;
          return;
        }
        await addItem(item, options);
        return;
      }

      const selected = await multiselect({
        message: 'Select items to add:',
        options: registry.items.map((item) => ({
          value: item.name,
          label: item.description,
        })),
      });

      if (isCancel(selected)) {
        console.log('Cancelled.');
        process.exitCode = 0;
        return;
      }

      if (selected.length === 0) {
        console.log('No items selected.');
        return;
      }

      const proceed = await confirm({
        message: `Add ${selected.length} item${selected.length === 1 ? '' : 's'}?`,
      });

      if (isCancel(proceed) || !proceed) {
        console.log('Cancelled.');
        return;
      }

      const itemsToAdd = registry.items.filter((entry) => selected.includes(entry.name));

      for (const item of itemsToAdd) {
        console.log(`\n── ${item.name} ──`);
        await addItem(item, options);
      }
    },
  );

program.parse();
