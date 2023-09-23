#!/usr/bin/env node

import prompts from "prompts";
// import { modifierNames } from "chalk";
// import chalkAnimation from "chalk-animation";
import { promisify } from "util";
import cp from "child_process";
// import path from "path";
import fs, { existsSync, mkdirSync } from "fs";

// convert libs to promises
const exec = promisify(cp.exec);
const rm = promisify(fs.rm);
const log = console.log;

// const welcome = "WELCOME DEVELOPER, TIME TO CREATE YOUR NEXT APP";
// chalkAnimation.glitch(welcome);

initQuestions = await prompts([
    {
    type: "select",
    name: "packageManager",
    message: "Choose a package manager",
    default: "pnpm",
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
    type: 'select',
    name: 'appLibrary',
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
])

log(questions);

// const name = await input({
//   message: "What is your project named?",
//   default: "my-app",
// });

// const typescript = await confirm({
//   message: "Would you like to use TypesScript?",
//   default: true,
// });

switch (questions.packageManager) {
  case "pnpm":
    switch (questions.appLibrary) {
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
