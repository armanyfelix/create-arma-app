import spawn from 'cross-spawn'
import { handleFile, injectFile } from '../../../utils/files.js'
import pc from 'picocolors'
import {
  _appJs,
  _appTsx,
  layoutJs,
  layoutTsx,
  providersAppJs,
  providersAppTsx,
  tailwindConfigJs,
  tailwindConfigSrcJs,
  tailwindConfigSrcTs,
  tailwindConfigTs,
} from './content.js'

// Reference: https://nextui.org/docs/frameworks/nextjs

export default async function generateNextUI(packageManager, projectName, appOptions) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []
  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('@nextui-org/react', 'framer-motion')

  // (1) Add dependencies
  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })
  if (child.status === 0) {
    // (2) Tailwind CSS Setup
    let tailwindConfigName = ''
    let tailwindConfigContent = ''
    if (appOptions.typescript) {
      tailwindConfigName = 'tailwind.config.ts'
      tailwindConfigContent = appOptions.srcDir ? tailwindConfigSrcTs : tailwindConfigTs
    } else {
      tailwindConfigName = 'tailwind.config.js'
      tailwindConfigContent = appOptions.srcDir ? tailwindConfigSrcJs : tailwindConfigJs
    }
    handleFile(projectName, tailwindConfigName, tailwindConfigContent)

    // (3) Setup Provider
    let providersName = ''
    let providersContent = ''
    // If src directory
    let filePath = appOptions.srcDir ? `${projectName}/src/` : `${projectName}/`
    // If app directory
    if (appOptions.app) {
      filePath += 'app/'
      if (appOptions.typescript) {
        providersName = 'providers.tsx'
        providersContent = providersAppTsx
      } else {
        providersName = 'providers.js'
        providersContent = providersAppJs
      }
      // If pages directory
    } else {
      filePath += 'pages/'
      if (appOptions.typescript) {
        providersName = '_app.tsx'
        providersContent = _appTsx
      } else {
        providersName = '_app.js'
        providersContent = _appJs
      }
    }
    handleFile(filePath, providersName, providersContent)
    console.log('filePath :>> ', filePath)

    // (4) Add Provider to root layout if app directory
    if (appOptions.app) {
      let layoutName = ''
      let layoutContent = ''
      if (appOptions.typescript) {
        layoutName = 'layout.tsx'
        layoutContent = layoutTsx
      } else {
        layoutName = 'layout.js'
        layoutContent = layoutJs
      }
      handleFile(filePath, layoutName, providersContent)
    }

    // (5) Use NextUI Components, create a button
    // (6) Setup pnpm (optional)
    if (packageManager === 'pnpm') {
      handleFile(projectName, '.npmrc', 'public-hoist-pattern[]=*@nextui-org/*')
    }
  } else {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('NextUI')}`)
  }
}
