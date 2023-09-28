import prompts from "prompts";
import pc from "picocolors";
import { spawn } from "cross-spawn";

export default async function createNextApp(projectName, packageManager) {
  const { blue, bgMagenta } = pc;
  let options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${blue("TypeScript")}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "eslint",
      message: `Would you like to use ${blue("ESLint")}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "tailwind",
      message: `Would you like to use ${blue("Tailwind CSS")}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "srcDir",
      message: `Would you like to use ${blue("`src/` directory")}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "app",
      message: `Would you like to use ${blue("App Router")}? (recommended)`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "alias",
      message: `Would you like to customize the default ${blue(
        "import alias"
      )}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
  ]);
  if (options.alias) {
    const alias = await prompts([
      {
        type: "text",
        name: "alias",
        message: `What ${blue("import alias")} would you like to configured?`,
        initial: "@/*",
      },
    ]);
    options = { ...options, ...alias };
  }

  const args = [];
  let pkg = "";
  switch (packageManager) {
    case "pnpm":
      pkg = "pnpm";
      args.push("dlx");
      args.push("create-next-app");
      break;
    case "yarn":
      pkg = "yarn";
      args.push("dlx");
      args.push("create-next-app");
      break;
    case "npm":
      pkg = "npx";
      args.push("create-next-app");
      break;
    case "bun":
      pkg = "bunx";
      args.push("create-next-app");
      break;
  }
  args.push(projectName);
  if (options.typescript) {
    args.push("--ts");
  } else {
    args.push("--js");
  }
  if (options.eslint) {
    args.push("--eslint");
  } else {
    args.push("--no-eslint");
  }
  if (options.tailwind) {
    args.push("--tailwind");
  } else {
    args.push("--no-tailwind");
  }
  if (options.srcDir) {
    args.push("--src-dir");
  } else {
    args.push("--no-src-dir");
  }
  if (options.app) {
    args.push("--app");
  } else {
    args.push("--no-app");
  }
  if (options.alias) {
    args.push(`--import-alias`);
    args.push(options.alias);
  } else {
    args.push(`--import-alias`);
    args.push("@/*");
  }
  args.push(`--use-${packageManager}`);

  console.log(`\n${bgMagenta(" RUNNING ")} ${pkg} ${args.join(" ")}\n`);

  const child = spawn.sync(pkg, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ADBLOCK: "1",
      // we set NODE_ENV to development as pnpm skips dev
      // dependencies when production
      NODE_ENV: "development",
      DISABLE_OPENCOLLECTIVE: "1",
    },
  });

  // const child = await exec(`${pkg} ${args.join(" ")}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.log(`stderr: ${stderr}`);
  // })

  return child.status;
}
