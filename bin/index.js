#!/usr/bin/env node

import pc from "picocolors";
import prompts from "prompts";
import { Command } from "commander";
import checkForUpdate from "update-check";
import packageJson from "../package.json" assert { type: "json" };
import path from "path";
import fs from "fs";
import getPkgManager from "../helpers/get-pkg-manager.js";
import validateNpmName from "../helpers/validate-pkg.js";
import isFolderEmpty from "../helpers/is-folder-empty.js";
import createNextApp from "../create-next-app.js";

const log = console.log;
let projectPath = "";
const { green, cyan, yellow, red, bold } = pc;

const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

const onPromptState = (state) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write("\x1B[?25h");
    process.stdout.write("\n");
    process.exit(1);
  }
};

const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments("[project-directory]")
  .usage(`${green("<project-directory>")} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .allowUnknownOption()
  .parse(process.argv);

const packageManager = getPkgManager();

async function run() {

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: "my-app",
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));
        if (validation.valid) {
          return true;
        }
        return "Invalid project name: " + validation.problems[0];
      },
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    log(
      "\nPlease specify the project directory:\n" +
        `  ${cyan(program.name())} ${green("<project-directory>")}\n` +
        "For example:\n" +
        `  ${cyan(program.name())} ${green("my-new-app")}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );

    problems.forEach((p) => console.error(`    ${red(bold("*"))} ${p}`));
    process.exit(1);
  }

  /**
   * Verify the project dir is empty or doesn't exist
   */
  const root = path.resolve(resolvedProjectPath);
  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const base = await prompts([
    {
      type: "select",
      name: "packageManager",
      message: "Choose a package manager",
      choices: [
        {
          title: "pnpm",
          value: "pnpm",
          // description: "pnpm is the fastest package manager",
        },
        {
          title: "yarn",
          value: "yarn",
          // description: "yarn is an awesome package manager",
        },
        {
          title: "npm",
          value: "npm",
          // description: "npm is the most popular package manager",
        },
        {
          title: "bun",
          value: "bun",
          // description: "bun is a new package manager",
        },
      ],
    },
    {
      type: "select",
      name: "appLibrary",
      message: "What kind of app do you want to create",
      choices: [
        {
          title: "create-next-app",
          value: "next",
          description: "Create a Next.js proyect with they cli tool",
        },
        // {
        //   title: "create-react-app",
        //   value: "react",
        //   description: "Create a classic React.js app",
        // },
        // {
        //   title: "create astro",
        //   value: "astro",
        //   description: "Create a new Astro app",
        // },
      ],
    },
  ]);

  // const install = spawn(base.packageManager, ["install", "-g", "create-next-app"], { stdio: 'inherit' });
  // install.stdout.on("data", (data) => {
  //   console.log("data :>> ", data);
  // })

  switch (base.appLibrary) {
    case "next":
      log("Creating Next.js app");
      const status = await createNextApp(projectName, base.packageManager);
      if (status === 0) {
      }
      break;
    case "react":
      break;
    case "astro":
      break;
    default:
      log("Error in selecting the app");
      process.exit(1);
      break;
  }
}

const update = checkForUpdate(packageJson).catch(() => null);

async function notifyUpdate() {
  try {
    const res = await update;
    if (res?.latest) {
      const updateMessage =
        packageManager === "yarn"
          ? "yarn global add create-ease-app"
          : packageManager === "pnpm"
          ? "pnpm add -g create-ease-app"
          : packageManager === "bun"
          ? "bun add -g create-ease-app"
          : "npm i -g create-ease-app";

      log(
        yellow(bold("A new version of `create-ease-app` is available!")) +
          "\n" +
          "You can update by running: " +
          cyan(updateMessage) +
          "\n"
      );
    }
    process.exit();
  } catch {
    // ignore error
  }
}

run()
  .then(notifyUpdate)
  .catch(async (reason) => {
    log();
    log("Aborting installation.");
    if (reason.command) {
      log(`  ${cyan(reason.command)} has failed.`);
    } else {
      log(red("Unexpected error. Please report it as a bug:") + "\n", reason);
    }
    log();

    await notifyUpdate();

    process.exit(1);
  });
