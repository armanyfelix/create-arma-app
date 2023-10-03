import pc from 'picocolors'
import spawn from 'cross-spawn'

/*
 * References:
 * https://redux.js.org/introduction/getting-started
 * https://jscrambler.com/blog/working-with-redux-in-next-js
 * https://blog.logrocket.com/use-redux-next-js
 */

export default async function generateRedux(packageManager, projectName) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []

  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('@reduxjs/toolkit')
  args.push('react-redux')
  args.push('next-redux-wrapper')

  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status !== 0) {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('Zustand')}`)
  }
}
