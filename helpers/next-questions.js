import prompts from "prompts";

export default async function nextQuestions() {
  const anwersBeforeAlias = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: "Would you like to use TypeScript?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "eslint",
      message: "Would you like to use ESLint?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "tailwind",
      message: "Would you like to use Tailwind CSS?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "appRouter",
      message: "Would you like to use `src/` directory? (recommended)",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "alias",
      message: "Would you like to customize the default import alias?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
  ]);
  if (anwersBeforeAlias.alias) {
    const alias = await prompts([
      {
        type: "text",
        name: "alias",
        message: "What import alias would you like to configured?",
        initial: "@/*",
      },
    ]);
  }

  return nextQuestions;
}
