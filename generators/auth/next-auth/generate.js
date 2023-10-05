import pc from 'picocolors'
import spawn from 'cross-spawn'

// Reference: https://next-auth.js.org/getting-started/example

export default async function generateGraphQL(packageManager, projectName, appOptions) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []

  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('next-auth')

  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status !== 0) {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('NextAuth')}`)
  }
}
