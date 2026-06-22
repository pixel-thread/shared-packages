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
 * ```
 */

import { Command } from "commander";
import { loadRegistry } from "./registry/index.js";
import { listItems } from "./commands/list.js";
import { addItem } from "./commands/add.js";

/** Create the root CLI program and register all commands. */
const program = new Command();

const registry = loadRegistry();

program
  .name("shared-packages")
  .description("Install shared source files into a project.")
  .version(registry.version);

program
  .command("list")
  .description("List available registry items.")
  .action(() => {
    listItems(registry);
  });

program
  .command("add")
  .description("Copy one registry item into the current project.")
  .argument("<item-name>", "Registry item name")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("--skip-install", "Do not install item dependencies")
  .action(async (itemName: string, options: { overwrite?: boolean; skipInstall?: boolean }) => {
    const item = registry.items.find((entry) => entry.name === itemName);

    if (!item) {
      console.error(`Item "${itemName}" was not found.`);
      console.error("Run `shared-packages list` to see available items.");
      process.exitCode = 1;
      return;
    }

    await addItem(item, options);
  });

program.parse();
