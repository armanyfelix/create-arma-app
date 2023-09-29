import spawn from 'cross-spawn'
import { createFile, injectFile } from '../../utils/files.js'
import pc from 'picocolors'

// Reference: https://nextui.org/docs/frameworks/nextjs

export default async function generateNextUI(packageManager, projectName) {
  const { magenta, bgGreen, bgRed, bgMagenta } = pc
  const args = []
  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('@nextui-org/react', 'framer-motion')
  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })
  if (child.status === 0) {
    // (2) Tailwind CSS Setup
    const data = [
      {
        line: 7,
        content: "    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',",
      },
    ]
    injectFile(projectName, 'tailwind.config.ts', data)

    if (packageManager === 'pnpm') {
      createFile(projectName, '.npmrc', 'public-hoist-pattern[]=*@nextui-org/*')
    }
  } else {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('NextUI')}`)
  }
}
