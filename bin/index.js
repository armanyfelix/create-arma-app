#!/usr/bin/env node

// import Conf from "conf";
import pc from "picocolors";
import prompts from "prompts";
import { Command } from "commander";
import checkForUpdate from "update-check";
import packageJson from "../package.json" assert { type: "json" };
import cp from "child_process";
import path from "path";
import fs from "fs";
import getPkgManager from "../helpers/get-pkg-manager.js";
import validateNpmName from "../helpers/validate-pkg.js";
import isFolderEmpty from '../helpers/is-folder-empty.js'

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
  .arguments("<project-directory>", "Proyect directory")
  .usage(`${green("<project-directory>")} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .allowUnknownOption()
  .parse(process.argv);

const packageManager = getPkgManager();

async function run() {
  // const confd = new conf({ projectName: 'create-next-app' })

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
    console.log(
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
    const root = path.resolve(resolvedProjectPath)
    const appName = path.basename(root)
    const folderExists = fs.existsSync(root)

    if (folderExists && !isFolderEmpty(root, appName)) {
      process.exit(1)
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
          description: "pnpm is the fastest package manager",
        },
        {
          title: "yarn",
          value: "yarn",
          description: "yarn is an awesome package manager",
        },
        {
          title: "npm",
          value: "npm",
          description: "npm is the most popular package manager",
        },
        {
          title: "bun",
          value: "bun",
          description: "bun is a new package manager",
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
          value: "create-next-app",
          description: "Create a Next.js proyect with they cli tool",
        },
        {
          title: "create-react-app",
          value: "create-react-app",
          description: "Create a classic React.js app",
        },
        {
          title: "create astro",
          value: "create astro",
          description: "Create a new Astro app",
        },
      ],
    },
  ]);

  switch (base.packageManager) {
    case "pnpm":
      switch (base.appLibrary) {
        case "create-next-app":
          const child = cp.spawn("npx", ["create-next-app", "hellospawn"]);

          child.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
          });

          child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
          });

          child.on("error", (error) => {
            console.error(`error: ${error.message}`);
          });

          child.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
          });

          break;
        case "create-react-app":
          break;
        case "create astro":
          break;
        default:
          log("Error in selecting the app");
          break;
      }
      break;
    case "yarn":
      break;
    case "npm":
      break;
    default:
      log("No package manager selected");
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

      console.log(
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
    console.log();
    console.log("Aborting installation.");
    if (reason.command) {
      console.log(`  ${cyan(reason.command)} has failed.`);
    } else {
      console.log(
        red("Unexpected error. Please report it as a bug:") + "\n",
        reason
      );
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });

// log('Yourname :>> ', chalk.red(answer))

// setInterval(() => {
//   const welcome = "Welcome to arma!"
// }, 1000)

// if (process.argv.length < 3) {
//   console.log("You have to provide a name to your app.");
//   console.log("For example :");
//   console.log("    npx simple-ts-app my-app");
//   process.exit(1);
// }

// const projectName = process.argv[2];
// const currentPath = process.cwd();
// const projectPath = path.join(currentPath, projectName);
// // TODO: change to your boilerplate repo
// const git_repo = "https://github.com/programonaut/simple-ts-app.git";

// // create project directory
// if (fs.existsSync(projectPath)) {
//   console.log(
//     `The file ${projectName} already exist in the current directory, please give it another name.`
//   );
//   process.exit(1);
// } else {
//   fs.mkdirSync(projectPath);
// }

// try {
//   // const gitSpinner = ora("Downloading files...").start();
//   // clone the repo into the project folder -> creates the new boilerplate
//   await exec(`git clone --depth 1 ${git_repo} ${projectPath} --quiet`);
//   // gitSpinner.succeed();

//   let i = 0;
//   process.stdout.write("Cargando ");
//   let interval = setInterval(() => {
//     process.stdout.clearLine();
//     process.stdout.cursorTo(0);
//     i = (i + 1) % 4;
//     let dots = new Array(i + 1).join(".");
//     process.stdout.write("Cargando " + dots);
//   }, 500);

//   setTimeout(() => {
//     clearInterval(interval);
//     process.stdout.clearLine();
//     process.stdout.cursorTo(0);
//     console.log("¡Hecho!");
//   }, 5000);

//   // const cleanSpinner = ora("Removing useless files").start();
//   // remove my git history
//   const rmGit = rm(path.join(projectPath, ".git"), {
//     recursive: true,
//     force: true,
//   });
//   // remove the installation file
//   const rmBin = rm(path.join(projectPath, "bin"), {
//     recursive: true,
//     force: true,
//   });
//   await Promise.all([rmGit, rmBin]);

//   process.chdir(projectPath);
//   // remove the packages needed for cli
//   // await exec("npm uninstall ora cli-spinners");
//   // cleanSpinner.succeed();

//   // const npmSpinner = ora("Installing dependencies...").start();
//   await exec("npm install");
//   //npmSpinner.succeed();

//   console.log("The installation is done!");
//   console.log("You can now run your app with:");
//   console.log(`    cd ${projectName}`);
//   console.log(`    npm run dev`);
// } catch (error) {
//   // clean up in case of error, so the user does not have to do it manually
//   fs.rmSync(projectPath, { recursive: true, force: true });
//   console.log(error);
// }
