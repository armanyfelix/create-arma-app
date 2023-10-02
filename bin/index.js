#!/usr/bin/env node

import pc from 'picocolors'
import prompts from 'prompts'
import { Command } from 'commander'
import checkForUpdate from 'update-check'
import packageJson from '../package.json' assert { type: 'json' }
import path from 'path'
import fs from 'fs'
import getPkgManager from '../helpers/get-pkg-manager.js'
import validateNpmName from '../helpers/validate-pkg.js'
import isFolderEmpty from '../helpers/is-folder-empty.js'
import createNextApp from '../commands/create-next-app.js'
import generateNextUI from '../generators/ui/nextui/generate.js'

const log = console.log
let projectPath = ''
const { green, cyan, yellow, red, bold, bgRed, bgGreen, magenta } = pc

const handleSigTerm = () => process.exit(0)

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const onPromptState = (state) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h')
    process.stdout.write('\n')
    process.exit(1)
  }
}

// Create the commander program
const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments('[project-directory]')
  .usage(`${green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name
  })
  .allowUnknownOption()
  .parse(process.argv)

const packageManager = getPkgManager()

// We start running the program options
async function run() {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems[0]
      },
    })

    if (typeof res.path === 'string') {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    log(
      '\nPlease specify the project directory:\n' +
        `  ${cyan(program.name())} ${green('<project-directory>')}\n` +
        'For example:\n' +
        `  ${cyan(program.name())} ${green('my-new-app')}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`
    )
    process.exit(1)
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const { valid, problems } = validateNpmName(projectName)
  if (!valid) {
    console.error(
      `Could not create a project called ${red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    )

    problems.forEach((p) => console.error(`    ${red(bold('*'))} ${p}`))
    process.exit(1)
  }

  // Verify the project dir is empty or doesn't exist
  const root = path.resolve(resolvedProjectPath)
  const appName = path.basename(root)
  const folderExists = fs.existsSync(root)

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const initOptions = await prompts([
    {
      type: 'select',
      name: 'packageManager',
      message: 'Choose a package manager',
      choices: [
        {
          title: 'pnpm',
          value: 'pnpm',
        },
        {
          title: 'yarn',
          value: 'yarn',
        },
        {
          title: 'npm',
          value: 'npm',
        },
        {
          title: 'bun',
          value: 'bun',
        },
      ],
    },
    {
      type: 'select',
      name: 'appLibrary',
      message: 'What kind of app do you want to create:',
      choices: [
        {
          title: 'create-next-app',
          value: 'next',
          description: 'Create a Next.js proyect with they cli tool',
        },
        // {
        //   title: "create-react-app",
        //   value: "react",
        //   description: "Create a classic React.js app",
        //   disabled: true,
        // },
        // {
        //   title: "create astro",
        //   value: "astro",
        //   description: "Create a new Astro app",
        // },
      ],
    },
  ])

  let appOptions = null
  switch (initOptions.appLibrary) {
    case 'next':
      log('Creating Next.js app')
      const res = await createNextApp(projectName, initOptions.packageManager)
      appOptions = res.options
      if (res.status === 0) {
        log(
          bgGreen(' READY '),
          "Your next.js app it's ready! Let's start the configuration ...\n"
        )
      } else {
        log(
          bgRed(' FAILED '),
          "Unexpected error. The process ended. Be sure that the package manager it's installed\n"
        )
        process.exit(res.status)
      }
      break
    case 'react':
      break
    case 'astro':
      break
    default:
      log(`\n${bgRed(' FAILED ')} The app library is not selected.\n`)
      process.exit(1)
  }

  const configOptions = await prompts([
    appOptions.tailwind && {
      type: 'select',
      name: 'ui',
      message: `Do you want to a ${magenta('UI components')} library? (using Tailwind)`,
      choices: [
        {
          title: 'None',
          value: false,
        },
        {
          title: 'NextUI',
          value: 'nextui',
        },
        {
          title: 'DaisyUI',
          value: 'daisyui',
        },
        {
          title: 'Shadcn/ui',
          value: 'shadcnui',
        },
        {
          title: 'KonstaUI',
          value: 'konstaui',
        },
      ],
    },
    {
      type: 'select',
      name: 'stateManager',
      message: `Maybe a ${magenta('state manager')}?`,
      choices: [
        {
          title: 'None',
          value: false,
        },
        {
          title: 'Zustand',
          value: 'zustand',
        },
        {
          title: 'Redux',
          value: 'redux',
        },
      ],
    },
    {
      type: 'select',
      name: 'orm',
      message: `Do you need a ${magenta('ORM')}?`,
      choices: [
        {
          title: 'None',
          value: false,
        },
        {
          title: 'Drizzle',
          value: 'drizzle',
        },
        {
          title: 'Prisma',
          value: 'prisma',
        },
      ],
    },
    {
      type: 'select',
      name: 'api',
      message: `What type of ${magenta('API')} do you want to build?`,
      choices: [
        {
          title: 'REST (default)',
          value: false,
        },
        {
          title: 'GraphQL',
          value: 'graphql',
        },
        {
          title: 'tRPC',
          value: 'trpc',
        },
        {
          title: 'gRPC',
          value: 'grpc',
        },
      ],
    },
    {
      type: 'select',
      name: 'auth',
      message: `Do you need ${magenta('authentication')}`,
      choices: [
        {
          title: 'None',
          value: false,
        },
        {
          title: 'Next-Auth',
          value: 'next-auth',
        },
        {
          title: 'Clark',
          value: 'clark',
        },
      ],
    },
    {
      type: 'select',
      name: 'theme',
      message: `Default ${magenta('theme')}:`,
      choices: [
        {
          title: 'Dark',
          value: 'dark',
        },
        {
          title: 'Light',
          value: 'light',
        },
      ],
    },
  ])

  if (Object.keys(configOptions).length !== 6) {
    process.exit(1)
  }

  // Installing UI components
  if (configOptions.ui) {
    // log(`\nInstalling ${magenta(.ui)} ...\n`);
    switch (configOptions.ui) {
      case 'nextui':
        await generateNextUI(initOptions.packageManager, projectName, appOptions)
        break
      default:
        break
    }
  }

  if (configOptions.stateManager) {
    log(`\nInstalling ${magenta(configOptions.stateManager)} ...\n`)
  }
  if (configOptions.orm) {
    log(`\nInstalling ${magenta(configOptions.orm)} ...\n`)
  }
  if (configOptions.api) {
    log(`\nInstalling ${magenta(configOptions.api)} ...\n`)
  }
  if (configOptions.auth) {
    log(`\nInstalling ${magenta(configOptions.auth)} ...\n`)
  }
  if (configOptions.theme) {
    log(`\nGoing to the ${magenta(configOptions.theme)} mode ...\n`)
  }
}

const update = checkForUpdate(packageJson).catch(() => null)

async function notifyUpdate() {
  try {
    const res = await update
    if (res?.latest) {
      const updateMessage =
        packageManager === 'yarn'
          ? 'yarn global add create-ease-app'
          : packageManager === 'pnpm'
          ? 'pnpm add -g create-ease-app'
          : packageManager === 'bun'
          ? 'bun add -g create-ease-app'
          : 'npm i -g create-ease-app'

      log(
        yellow(bold('A new version of `create-ease-app` is available!')) +
          '\n' +
          'You can update by running: ' +
          cyan(updateMessage) +
          '\n'
      )
    }
    process.exit()
  } catch {
    // ignore error
  }
}

run()
  .then(notifyUpdate)
  .catch(async (reason) => {
    log()
    log('Aborting installation.')
    if (reason.command) {
      log(`  ${cyan(reason.command)} has failed.`)
    } else {
      log(red('Unexpected error. Please report it as a bug:') + '\n', reason)
    }
    log()

    await notifyUpdate()

    process.exit(1)
  })
