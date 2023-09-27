import prompts from "prompts";
import pc from "picocolors";

export default async function createNextApp() {
  const { blue } = pc;
  let options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${blue('TypeScript')}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "eslint",
      message: `Would you like to use ${blue('ESLint')}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "tailwind",
      message: `Would you like to use ${blue('Tailwind CSS')}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "srcDir",
      message: `Would you like to use ${blue('`src/` directory')}?`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "app",
      message: `Would you like to use ${blue('App Router')}? (recommended)`,
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "alias",
      message: `Would you like to customize the default ${blue('import alias')}?`,
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
        message: `What ${blue('import alias')} would you like to configured?`,
        initial: "@/*",
      },
    ]);
    options = { ...options, ...alias };
  }

  return options;
}
