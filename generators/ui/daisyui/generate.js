import pc from 'picocolors'
import {
  tailwindConfigJs,
  tailwindConfigSrcJs,
  tailwindConfigSrcTs,
  tailwindConfigTs,
} from './content.js'
import { handleFile } from '../../../utils/files.js'
import spawn from 'cross-spawn'

// Reference: https://daisyui.com/docs/install

export default async function generateDaisyUI(packageManager, projectName, appOptions) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []
  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('-D')
  args.push('daisyui@latest')

  // (1) Add dependencies
  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status === 0) {
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
  } else {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('DaisyUI')}`)
  }
}
