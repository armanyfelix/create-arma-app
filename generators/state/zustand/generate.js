import pc from 'picocolors'
import spawn from 'cross-spawn'

// Reference: https://github.com/pmndrs/zustand

export default async function generateZustand(packageManager, projectName) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []

  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('zustand')

  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status !== 0) {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('Zustand')}`)
  }
}
